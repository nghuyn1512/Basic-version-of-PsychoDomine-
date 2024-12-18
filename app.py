from flask import Flask,render_template, jsonify, request,send_from_directory
from flask_cors import CORS
import requests,os,random
app = Flask(__name__)
CORS(app)
app.static_folder = 'static'
@app.route('/css/<path:filename>')
def css(filename):
    return send_from_directory(os.path.join(app.root_path, 'css'), filename)

@app.route('/js/<path:filename>')
def js(filename):
    return send_from_directory(os.path.join(app.root_path,'js'), filename)

@app.route('/image/<path:filename>')
def image(filename):
    return send_from_directory(os.path.join(app.root_path,'image'), filename)

@app.route('/post-page.html')
def post_page():
    post_id = request.args.get('id')
    if not post_id:
        return "Post ID is required", 400
    return render_template('post-page.html', post_id=post_id)

@app.route("/")
def library():
    return render_template('library.html')

#GraphQL API url
url = "https://ap-southeast-2.cdn.hygraph.com/content/cllgr1aps0ei201t1d0bf3py3/master"
    
@app.route("/get_posts", methods=["GET"])
def get_posts():
    first = int(request.args.get('first', 40))
    skip = int(request.args.get('skip', 0))

    query = """
    query MyQuery($first: Int!, $skip: Int!) {
        posts(first: $first, skip: $skip) {
            title
            datePost
            slug
            authors {
                name
                id
                image {
                    url
                }
            }
            categories{
                name
                slug
            }
            content {
                html
            }
            photoPost {
                url
            }
        }
    }
    """
    variables = {"first": first, "skip": skip}
    response = requests.post(url, json={'query': query, 'variables': variables})

    if response.status_code == 200:
        data = response.json()
        posts = data.get('data', {}).get('posts', [])
        return jsonify(posts)
    else:
        print("GraphQL error:", response.text)
        return jsonify({'error': 'Failed to fetch posts', 'details': response.text}), 500

#lấy featuredPost từ GraphQL API    
@app.route("/featured_post")
def featured():
    query = """
    
query MyQuery {
        posts(where: {featuredPost: true}, first: 20) {
            title
            categories {
                name
            }
            authors {
                name
                image {
                    url
                }
            }
            photoPost {
                url
            }
            slug
  			content{
              html
            }
        }
    }    
    """
    response = requests.post(url, json={'query': query})
    if response.status_code == 200:
        data = response.json()
        featured= data.get('data', {}).get('posts', [])
        if not featured:
            return jsonify({"error": "No featured post found"}), 404
    else:
        print("GraphQL error:", response.text)
        return jsonify({"error": "Failed to fetch featured post"}), 500
    random_post = random.choice(featured)
    return jsonify(random_post)

#hiển thị bài viết
@app.route("/post", methods=["GET"])
def post():
    slug = request.args.get('slug')
    if not slug:
        return jsonify({'error': 'Missing slug parameter'}), 400

    query = """
    query GetPosts($slug: String!) {
        post(where: {slug: $slug}) {
            title
            datePost
            slug
            authors {
                name
                id
                image {
                    url
                }
            }
            categories {
                name
                slug
            }
            content {
                html
            }
            photoPost {
                url
            }
        }
    }
    """

    var = {"slug": slug}
    response = requests.post(url, json={'query': query, 'variables': var})
    if response.status_code == 200:
        data = response.json()
        post_data = data.get('data', {}).get('post')
        if not post_data:
            return jsonify({"error": "Cannot find post"}), 404
        return jsonify(post_data)
    
    else:
        print("GraphQL error:", response.text)
        return jsonify({"error": "Failed to fetch post data"}), 500


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port,debug=True)
