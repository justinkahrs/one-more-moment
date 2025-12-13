
import https from 'https';

const TOKEN = process.env.FOURTHWALL_STOREFRONT_TOKEN;
const BASE_URL = "https://storefront-api.fourthwall.com/v1";

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch(e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function run() {
    try {
        console.log("Fetching Collections...");
        const colRes = await fetchJSON(`${BASE_URL}/collections?storefront_token=${TOKEN}`);
        const collections = colRes.results || colRes;
        
        console.log(`Found ${collections.length} collections.`);
        collections.forEach((c, i) => {
            console.log(`[${i}] ${c.name} (slug: ${c.slug})`);
        });

        if(collections.length > 0) {
            const firstSlug = collections[0].slug;
            console.log(`\nFetching products for FIRST collection: ${firstSlug}...`);
            const prodRes = await fetchJSON(`${BASE_URL}/collections/${firstSlug}/products?storefront_token=${TOKEN}`);
            const products = prodRes.results || prodRes;
            
            console.log(`Found ${products.length} products.`);
            products.forEach(p => {
                console.log(`\n- Product: ${p.name}`);
                console.log(`  Variants: ${p.variants.length}`);
                
                // Group attributes to see unique colors
                const colors = new Set();
                p.variants.forEach(v => {
                   if(v.attributes?.color) {
                       colors.add(v.attributes.color.name || v.attributes.color);
                   }
                });
                console.log(`  Unique Colors: ${Array.from(colors).join(", ") || "None"}`);

                // Dump first variant attributes for inspection
                if(p.variants.length > 0) {
                   console.log(`  Sample Attributes (Var 0): ${JSON.stringify(p.variants[0].attributes)}`);
                }
            });
        }
    } catch(e) {
        console.error(e);
    }
}

run();
