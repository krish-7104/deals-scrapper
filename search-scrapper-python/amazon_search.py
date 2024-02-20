from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from utils.search_match import find_match

app = Flask(__name__)


def amazon_search_product(search_query):
    try:
        if not search_query:
            return {"error": "No search query provided"}, 400

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }

        url = f"https://www.amazon.in/s?k={search_query}"
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')

            products = []
            titles = []

            product_containers = soup.find_all('div', class_='s-result-item')
            for product in product_containers:
                title = product.find('span', class_='a-text-normal')
                discount_price = product.find('span', class_='a-offscreen')
                original_price = product.find('span', class_='a-price')
                link_tag = product.find('a', class_='a-link-normal', href=True)
                image = product.find('img', class_='s-image')

                if title and discount_price and original_price and link_tag and image:
                    title_text = title.get_text(strip=True)
                    discount_price_text = int(discount_price.get_text(
                        strip=True).replace(',', '').replace('₹', ''))
                    original_price_text = int(original_price.find(
                        'span', class_='a-offscreen').get_text(strip=True).replace(',', '').replace('₹', ''))
                    discount = int(
                        round(((original_price_text - discount_price_text) / original_price_text) * 100))
                    link = 'https://www.amazon.in' + link_tag['href']
                    image_src = image['src']

                    products.append({
                        'title': title_text,
                        'discount_price': discount_price_text,
                        'original_price': original_price_text,
                        'discount': discount,
                        'link': link,
                        'image': image_src
                    })
                    titles.append(title_text)

            if products:
                # Match the best product
                product_index = find_match(search_query, titles)
                if product_index is not None:
                    best_match = products[product_index]
                    other_products = [product for i, product in enumerate(
                        products) if i != product_index]
                    return {"best": best_match, "data": other_products}

        return {"error": "No matching product found"}, 404

    except Exception as e:
        print("Get Amazon Search Product Error: ", e)
        return {"error": "An error occurred while processing the request"}, 500


@app.route('/amazon/search')
def search_amazon_product():
    search_query = request.args.get('q')
    result = amazon_search_product(search_query)
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)
