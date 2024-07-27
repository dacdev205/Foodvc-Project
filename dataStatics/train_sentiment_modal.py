from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import joblib
import os
import pandas as pd


def load_data_from_folder(folder_path, label):
    texts = []
    labels = []
    files_read = 0
    
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        if os.path.isfile(file_path):
            with open(file_path, 'r', encoding='utf-8') as file:
                texts.append(file.read())
                labels.append(label)
                files_read += 1
    
    return pd.DataFrame({'comment': texts, 'label': labels})

df_positive = load_data_from_folder(r'C:\Users\ADMIN\Downloads\data_train\train\pos', 'positive')

df_negative = load_data_from_folder(r'C:\Users\ADMIN\Downloads\data_train\train\neg', 'negative')

# Kết hợp dữ liệu từ các thư mục
df = pd.concat([df_positive, df_negative], ignore_index=True)

stopwords_vietnamese = [
    'và', 'là', 'của', 'trong', 'để', 'cho', 'với', 'có', 'như', 'một', 'cái', 'đã', 'từ', 'này', 'các'
    # Thêm các từ dừng khác ở đây
]

# Tiền xử lý dữ liệu
vectorizer = TfidfVectorizer(stop_words=stopwords_vietnamese)
X = vectorizer.fit_transform(df['comment'])

# Tạo và huấn luyện mô hình
model = MultinomialNB()
model.fit(X, df['label'])

# Lưu mô hình
joblib.dump((model, vectorizer), 'sentiment_model.pkl')

print("Model được tạo với tên sentiment_model.pkl")


