from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from bson import ObjectId

app = Flask(__name__)
CORS(app)  # Cho phép tất cả các nguồn gốc, bạn có thể cấu hình tùy chỉnh nếu cần

# Kết nối đến MongoDB
client = MongoClient('mongodb+srv://congdat147x:0962034466a@cluster0.dqeuvj7.mongodb.net/Foodvc')  
db = client['Foodvc']  # tên cơ sở dữ liệu
collection = db['reviews']  # tên collection

# Tải mô hình và vectorizer
model, vectorizer = joblib.load('dataStatics/sentiment_model.pkl')

# Hàm phân tích cảm xúc
def analyze_sentiment(text):
    X = vectorizer.transform([text])
    prediction = model.predict(X)
    return prediction[0]

# Hàm chuyển đổi ObjectId thành chuỗi
def json_serializer(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    raise TypeError("Type not serializable")

@app.route('/data', methods=['GET'])
def get_data():
    # Truy xuất dữ liệu từ MongoDB
    data = list(collection.find())
    result = []
    for item in data:
        comment = item.get('comment', '')
        # Phân tích cảm xúc nếu có bình luận
        sentiment = analyze_sentiment(comment) if comment else None
        # Thêm trường cảm xúc vào dữ liệu
        item['sentiment'] = sentiment
        # Chuyển ObjectId thành chuỗi
        item['_id'] = str(item['_id'])
        if 'productId' in item:
            item['productId'] = str(item['productId'])
        if 'userId' in item:
            item['userId'] = str(item['userId'])
        result.append(item)
    return jsonify(result)

@app.route('/data', methods=['POST'])
def post_data():
    # Nhận dữ liệu từ client
    data = request.json
    # Xử lý dữ liệu (phân tích cảm xúc)
    if 'comment' in data:
        sentiment = analyze_sentiment(data['comment'])
        return jsonify({'status': 'success', 'comment': data['comment'], 'sentiment': sentiment})
    else:
        return jsonify({'status': 'error', 'message': 'No comment provided'}), 400

@app.route('/sentiment-stats', methods=['GET'])
def get_sentiment_stats():
    data = list(collection.find())
    total_reviews = len(data)
    positive_reviews = sum(1 for item in data if analyze_sentiment(item.get('comment', '')) == 'positive')
    negative_reviews = total_reviews - positive_reviews
    positive_percentage = (positive_reviews / total_reviews) * 100 if total_reviews > 0 else 0
    negative_percentage = (negative_reviews / total_reviews) * 100 if total_reviews > 0 else 0

    return jsonify({
        'total_reviews': total_reviews,
        'positive_reviews': positive_reviews,
        'negative_reviews': negative_reviews,
        'positive_percentage': positive_percentage,
        'negative_percentage': negative_percentage
    })

if __name__ == '__main__':
    app.run(debug=True)
