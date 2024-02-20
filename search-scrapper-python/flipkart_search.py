import time
from flask import Flask, request, jsonify
from bs4 import BeautifulSoup
import requests
from utils.search_match import find_match

app = Flask(__name__)


@app.route('/flipkart/search')
def flipkart_search_product():
    try:
        search_query = request.args.get('q')
        if not search_query:
            return jsonify({'error': 'No search query provided'}), 400

        url = f'https://www.flipkart.com/search?q={search_query}'
        response = requests.get(url)
        time.sleep(3)
        soup = BeautifulSoup(response.text, 'html.parser')

        data = []
        titles = []

        products = soup.find_all(class_='_1AtVbE col-12-12')
        for product in products:

            childrens = product.select('._13oc-S > *')

            if len(childrens) == 1:

                title = str(product.find(class_='_4rR01T').get_text(
                ).strip()) if product.find(class_='_4rR01T') else None

                discount_price = int(product.find(class_='_30jeq3 _1_WHN1').get_text(
                ).strip().replace('₹', '').replace(',', '')) if product.find(class_='_30jeq3 _1_WHN1') else None

                original_price = int(product.find(class_='_3I9_wc _27UcVY').get_text(
                ).strip().replace('₹', '').replace(',', '')) if product.find(class_='_3I9_wc _27UcVY') else None

                discount = int(product.find(class_='_3Ay6Sb').get_text(
                ).strip().replace('% off', '').replace(',', '')) if product.find(class_='_3Ay6Sb') else None

                link = 'https://www.flipkart.com' + \
                    product.find(class_='_1fQZEK').get(
                        'href') if product.find(class_='_1fQZEK') else None

                image = product.find(class_='_396cs4').get(
                    'src') if product.find(class_='_396cs4') else None

                if title and discount_price and original_price and discount and link and image:
                    data.append({
                        'title': title,
                        'discount_price': discount_price,
                        'original_price': original_price,
                        'discount': discount,
                        'link': link,
                        'image': image
                    })
                    titles.append(title)

            elif len(childrens) == 4:
                for child in childrens:

                    title = child.find(class_='IRpwTa').get_text(
                    ).strip() if child.find(class_='IRpwTa') else None

                    discount_price = int(child.find(class_='_30jeq3').get_text(
                    ).strip().replace('₹', '').replace(',', '')) if child.find(class_='_30jeq3') else None

                    original_price = int(child.find(class_='_3I9_wc').get_text(
                    ).strip().replace('₹', '').replace(',', '')) if child.find(class_='_3I9_wc') else None

                    discount = int(child.find(class_='_3Ay6Sb').get_text(
                    ).strip().replace('% off', '').replace(',', '')) if child.find(class_='_3Ay6Sb') else None

                    link = 'https://www.flipkart.com' + \
                        child.find(class_='IRpwTa').get(
                            'href') if child.find(class_='IRpwTa') else None

                    image = child.find(class_='_2r_T1I').get(
                        'src') if child.find(class_='_2r_T1I') else None

                    if title and discount_price and original_price and discount and link and image:
                        data.append({
                            'title': title,
                            'discount_price': discount_price,
                            'original_price': original_price,
                            'discount': discount,
                            'link': link,
                            'image': image
                        })
                        titles.append(title)

        if len(data) > 0:

            product_index = find_match(search_query, titles)
            if product_index is not None:
                best_match = data[product_index]
                other_products = [data[i]
                                  for i in range(len(data)) if i != product_index]
                return jsonify({'best': best_match, 'data': other_products})

        return jsonify({'error': 'No matching product found'}), 404
    except Exception as e:
        print("Get Flipkart Search Product Error: ", e)
        return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    app.run(debug=True)
