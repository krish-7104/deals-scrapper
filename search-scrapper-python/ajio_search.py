from flask import Flask, request, jsonify
from playwright.sync_api import sync_playwright
from utils.search_match import find_match

app = Flask(__name__)


async def auto_scroll(page):
    await page.evaluate('''async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 60;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight || totalHeight >= 2000) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    }''')


@app.route('/ajio/search', methods=['GET'])
def ajio_search_product():
    try:
        search_query = request.args.get('q')
        if not search_query:
            return jsonify({'error': 'No search query provided'}), 400

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=False)
            page = browser.new_page()
            page.goto(
                f'https://www.ajio.com/search/?text={search_query}', wait_until='networkidle')
            auto_scroll(page)

            products = page.evaluate('''() => {
                const data = [];
                const titles = [];
                const processedUrls = new Set();

                document.querySelectorAll('.item.rilrtl-products-list__item.item').forEach(product => {
                    if (product) {
                        const title = (product.querySelector('.nameCls')?.innerText.trim() || '') + " (" + (product.querySelector('.brand')?.innerText.trim() || '') + ")";
                        const discount_price = product.querySelector('.price')?.innerText.replace(/[^\d.]/g, '');
                        const original_price = product.querySelector('.orginal-price')?.innerText.replace(/[^\d.]/g, '');
                        const discount = product.querySelector('.discount')?.innerText.replace(/[^\d.]/g, '');
                        const link = 'https://www.ajio.com' + (product.querySelector('a')?.getAttribute('href') || '');
                        const image = product.querySelector('.rilrtl-lazy-img.rilrtl-lazy-img-loaded')?.getAttribute('src') || '';
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
        print("Get Ajio Search Product Error:", error)
        return jsonify({'error': 'Internal Server Error'}), 500


if __name__ == '__main__':
    app.run(debug=True)
