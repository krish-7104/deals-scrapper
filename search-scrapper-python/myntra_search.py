from flask import Flask, request, jsonify
from playwright.sync_api import sync_playwright
from utils.search_match import find_match

app = Flask(__name__)


@app.route('/myntra/search', methods=['GET'])
def myntra_search_product():
    try:
        search_query = request.args.get('q')
        if not search_query:
            return jsonify({'error': 'No search query provided'}), 400

        print("All is well till now")
        with sync_playwright() as p:
            browser = p.firefox.launch(headless=False)
            page = browser.new_page()
            search_query = search_query.replace(" ", "-")

            page.goto(f"https://www.myntra.com/{search_query}")
            page.wait_for_load_state('domcontentloaded')

            products = page.evaluate('''() => {
                const data = [];
                const titles = [];
                const processedUrls = new Set();

                document.querySelectorAll('.product-base').forEach(product => {
                    if (product) {
                        const title = product.querySelector('.product-product')?.innerText.trim();
                        const discount_price = product.querySelector('.product-discountedPrice')?.innerText.replace("Rs. ", "").replace(/[^\d.]/g, '');
                        const original_price = product.querySelector('.product-strike')?.innerText.replace("Rs. ", "").replace(/[^\d.]/g, '');
                        const discount = product.querySelector('.product-discountPercentage')?.innerText.replace("Rs. ", "").replace(/[^\d.]/g, '');
                        const link = 'https://www.myntra.com/' + product.querySelector('a')?.getAttribute('href');
                        const image = product.querySelector('img')?.getAttribute('src');
                        if (!processedUrls.has(link)) {
                            data.push({
                                title, discount_price: parseInt(discount_price), original_price: parseInt(original_price), discount: parseInt(discount), link, image
                            });
                            titles.push(title)
                        }
                    }
                });

                return { data, titles };
            }''')
            browser.close()

        if products['data']:
            product_index = find_match(search_query, products['titles'])
            if product_index is not None:
                best_match = products['data'][product_index]
                other_products = [prod for index, prod in enumerate(
                    products['data']) if index != product_index]
                return jsonify({'best': best_match, 'data': other_products})

        return jsonify({'error': 'No matching product found'}), 404

    except Exception as error:
        print("Get Myntra Search Product Error:", error)
        return jsonify({'error': 'Internal Server Error'}), 500


if __name__ == '__main__':
    app.run(debug=True)
