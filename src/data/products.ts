import { Product } from '../store/slices/productSlice';

export const allProducts: Product[] = [
    // ——— ELECTRONICS (8 products) ———
    {
        id: '1',
        name: 'iPhone 15 Pro Max',
        description: 'Titanium design with A17 Pro chip, 48MP camera system, and all-day battery life. The most powerful iPhone ever.',
        price: 1199,
        rating: 4.9,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'storage', label: 'Storage', options: ['256GB', '512GB', '1TB'] },
            { type: 'color', label: 'Color', options: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'] }
        ],
        specs: [
            { label: 'Display', value: '6.7" Super Retina XDR' },
            { label: 'Chip', value: 'A17 Pro' },
            { label: 'Camera', value: '48MP Main + 12MP Ultra Wide' },
            { label: 'Battery', value: 'Up to 29hr video playback' }
        ]
    },
    {
        id: '2',
        name: 'Sony WH-1000XM5 Headphones',
        description: 'Industry-leading noise cancellation with exceptional sound quality. 30-hour battery life and ultra-comfortable design.',
        price: 349,
        rating: 4.8,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'color', label: 'Color', options: ['Black', 'Silver', 'Midnight Blue'] }
        ],
        specs: [
            { label: 'Driver', value: '30mm' },
            { label: 'Battery', value: '30 hours' },
            { label: 'Noise Cancelling', value: 'Yes (Auto NC Optimizer)' },
            { label: 'Weight', value: '250g' }
        ]
    },
    {
        id: '3',
        name: 'MacBook Air M3',
        description: 'Supercharged by M3 chip. Strikingly thin design, up to 18 hours of battery life, and a stunning Liquid Retina display.',
        price: 1099,
        rating: 4.9,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'storage', label: 'Configuration', options: ['8GB/256GB', '8GB/512GB', '16GB/512GB', '24GB/1TB'] },
            { type: 'color', label: 'Color', options: ['Midnight', 'Starlight', 'Space Gray', 'Silver'] }
        ],
        specs: [
            { label: 'Display', value: '13.6" Liquid Retina' },
            { label: 'Chip', value: 'Apple M3' },
            { label: 'Battery', value: 'Up to 18 hours' },
            { label: 'Weight', value: '1.24 kg' }
        ]
    },
    {
        id: '4',
        name: 'iPad Pro 12.9"',
        description: 'The ultimate iPad experience with M2 chip, Liquid Retina XDR display, and Apple Pencil hover support.',
        price: 1099,
        rating: 4.7,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1561154464-82e9aab73b2a?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'storage', label: 'Storage', options: ['128GB', '256GB', '512GB', '1TB'] },
            { type: 'color', label: 'Color', options: ['Space Gray', 'Silver'] }
        ],
        specs: [
            { label: 'Display', value: '12.9" Liquid Retina XDR' },
            { label: 'Chip', value: 'Apple M2' },
            { label: 'Camera', value: '12MP Wide + 10MP Ultra Wide' },
            { label: 'Connectivity', value: 'Wi-Fi 6E + 5G (optional)' }
        ]
    },
    {
        id: '5',
        name: 'Samsung Galaxy Watch 6',
        description: 'Advanced health monitoring with BioActive Sensor, sapphire crystal glass, and seamless Galaxy ecosystem integration.',
        price: 329,
        rating: 4.5,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'color', label: 'Color', options: ['Graphite', 'Gold', 'Silver'] }
        ],
        specs: [
            { label: 'Display', value: '1.5" Super AMOLED' },
            { label: 'Battery', value: 'Up to 40 hours' },
            { label: 'Water Resistance', value: '5ATM + IP68' },
            { label: 'OS', value: 'Wear OS 4' }
        ]
    },
    {
        id: '6',
        name: 'Bose SoundLink Flex Speaker',
        description: 'Portable Bluetooth speaker with deep, clear sound. Waterproof, dustproof, and built to resist corrosion.',
        price: 149,
        rating: 4.6,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'color', label: 'Color', options: ['Black', 'White Smoke', 'Stone Blue', 'Carmine Red'] }
        ],
        specs: [
            { label: 'Battery', value: 'Up to 12 hours' },
            { label: 'Water Resistance', value: 'IP67' },
            { label: 'Connectivity', value: 'Bluetooth 5.1' },
            { label: 'Weight', value: '590g' }
        ]
    },
    {
        id: '7',
        name: 'Kindle Paperwhite',
        description: 'The thinnest, lightest Kindle Paperwhite yet with a 6.8" display, adjustable warm light, and 10 weeks of battery.',
        price: 139,
        rating: 4.7,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1594377157609-5c996118ac7f?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1594377157609-5c996118ac7f?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1544716278-e513176f20b5?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'storage', label: 'Storage', options: ['8GB', '16GB'] },
            { type: 'color', label: 'Color', options: ['Black', 'Denim', 'Agave Green'] }
        ],
        specs: [
            { label: 'Display', value: '6.8" Glare-Free' },
            { label: 'Battery', value: 'Up to 10 weeks' },
            { label: 'Water Resistance', value: 'IPX8' },
            { label: 'Storage', value: '8GB or 16GB' }
        ]
    },
    {
        id: '8',
        name: 'Logitech MX Master 3S Mouse',
        description: 'Advanced wireless mouse with MagSpeed scroll, ergonomic design, and quiet clicks. Works on any surface.',
        price: 99,
        rating: 4.8,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1586349906319-47f5b9a13292?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'color', label: 'Color', options: ['Graphite', 'Pale Gray'] }
        ],
        specs: [
            { label: 'Sensor', value: '8000 DPI' },
            { label: 'Battery', value: '70 days (full charge)' },
            { label: 'Connectivity', value: 'Bluetooth + USB-C' },
            { label: 'Weight', value: '141g' }
        ]
    },

    // ——— APPAREL (8 products) ———
    {
        id: '9',
        name: 'Classic White Oxford Shirt',
        description: 'Premium 100% cotton Oxford shirt with a tailored fit. A wardrobe essential for any professional setting.',
        price: 89,
        rating: 4.6,
        category: 'Apparel',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1598033129183-c4f50c736c10?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'size', label: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] },
            { type: 'color', label: 'Color', options: ['White', 'Light Blue', 'Pink'] }
        ],
        specs: [
            { label: 'Material', value: '100% Premium Cotton' },
            { label: 'Fit', value: 'Tailored' },
            { label: 'Care', value: 'Machine Washable' },
            { label: 'Collar', value: 'Button-Down' }
        ]
    },
    {
        id: '10',
        name: 'Slim Fit Chino Pants',
        description: 'Versatile stretch chinos with a modern slim fit. Perfect for office or weekend wear with a clean finish.',
        price: 65,
        rating: 4.5,
        category: 'Apparel',
        image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'size', label: 'Size', options: ['28', '30', '32', '34', '36'] },
            { type: 'color', label: 'Color', options: ['Khaki', 'Navy', 'Black', 'Olive'] }
        ],
        specs: [
            { label: 'Material', value: '98% Cotton, 2% Elastane' },
            { label: 'Fit', value: 'Slim' },
            { label: 'Care', value: 'Machine Washable' },
            { label: 'Rise', value: 'Mid-Rise' }
        ]
    },
    {
        id: '11',
        name: 'Merino Wool Crewneck Sweater',
        description: 'Ultra-soft merino wool sweater with temperature-regulating properties. Lightweight yet warm for layering.',
        price: 120,
        rating: 4.7,
        category: 'Apparel',
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1434389677669-e08b4cda3a7d?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'size', label: 'Size', options: ['S', 'M', 'L', 'XL'] },
            { type: 'color', label: 'Color', options: ['Charcoal', 'Navy', 'Burgundy', 'Forest Green'] }
        ],
        specs: [
            { label: 'Material', value: '100% Merino Wool' },
            { label: 'Fit', value: 'Regular' },
            { label: 'Care', value: 'Hand Wash / Dry Clean' },
            { label: 'Season', value: 'Fall / Winter' }
        ]
    },
    {
        id: '12',
        name: 'Running Sneakers Pro',
        description: 'Lightweight performance running shoes with responsive cushioning and breathable mesh upper for daily runs.',
        price: 130,
        rating: 4.6,
        category: 'Apparel',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'size', label: 'Size (US)', options: ['7', '8', '9', '10', '11', '12'] },
            { type: 'color', label: 'Color', options: ['Black/White', 'Red/Black', 'Blue/Gray'] }
        ],
        specs: [
            { label: 'Upper', value: 'Breathable Mesh' },
            { label: 'Sole', value: 'Rubber with EVA Foam' },
            { label: 'Drop', value: '8mm' },
            { label: 'Weight', value: '280g (US 9)' }
        ]
    },
    {
        id: '13',
        name: 'Waterproof Winter Jacket',
        description: 'Insulated waterproof jacket with sealed seams and adjustable hood. Built for harsh weather conditions.',
        price: 245,
        rating: 4.8,
        category: 'Apparel',
        image: 'https://images.unsplash.com/photo-1544923246-77307dd270cf?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1544923246-77307dd270cf?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'size', label: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] },
            { type: 'color', label: 'Color', options: ['Black', 'Navy', 'Olive', 'Dark Red'] }
        ],
        specs: [
            { label: 'Material', value: 'Nylon with DWR Coating' },
            { label: 'Insulation', value: 'Synthetic Down' },
            { label: 'Waterproof Rating', value: '10,000mm' },
            { label: 'Features', value: 'Adjustable Hood, Sealed Seams' }
        ]
    },
    {
        id: '14',
        name: 'Cotton Jogger Pants',
        description: 'Premium French terry joggers with tapered leg and elastic cuffs. Ultimate comfort for lounging or casual outings.',
        price: 55,
        rating: 4.4,
        category: 'Apparel',
        image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1515586000433-45406d8e6662?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'size', label: 'Size', options: ['S', 'M', 'L', 'XL'] },
            { type: 'color', label: 'Color', options: ['Heather Gray', 'Black', 'Navy'] }
        ],
        specs: [
            { label: 'Material', value: '80% Cotton, 20% Polyester' },
            { label: 'Fit', value: 'Tapered' },
            { label: 'Care', value: 'Machine Washable' },
            { label: 'Features', value: 'Elastic Waist, Zippered Pockets' }
        ]
    },
    {
        id: '15',
        name: 'Graphic Crew T-Shirt',
        description: 'Soft ring-spun cotton tee with a modern relaxed fit. Screen-printed graphics that won\'t fade after washing.',
        price: 35,
        rating: 4.3,
        category: 'Apparel',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'size', label: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] },
            { type: 'color', label: 'Color', options: ['White', 'Black', 'Gray'] }
        ],
        specs: [
            { label: 'Material', value: '100% Ring-Spun Cotton' },
            { label: 'Fit', value: 'Relaxed' },
            { label: 'Care', value: 'Machine Washable' },
            { label: 'Print', value: 'Screen-Printed (Fade Resistant)' }
        ]
    },
    {
        id: '16',
        name: 'Denim Jacket Classic',
        description: 'Timeless denim jacket with a modern silhouette. Durable cotton denim with subtle distressed details.',
        price: 95,
        rating: 4.5,
        category: 'Apparel',
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'size', label: 'Size', options: ['S', 'M', 'L', 'XL'] },
            { type: 'color', label: 'Wash', options: ['Light Wash', 'Medium Wash', 'Dark Wash'] }
        ],
        specs: [
            { label: 'Material', value: '100% Cotton Denim' },
            { label: 'Fit', value: 'Regular' },
            { label: 'Care', value: 'Machine Washable Cold' },
            { label: 'Closure', value: 'Metal Button Front' }
        ]
    },

    // ——— ACCESSORIES (8 products) ———
    {
        id: '17',
        name: 'Leather Bifold Wallet',
        description: 'Handcrafted full-grain leather wallet with RFID protection. Slim profile fits comfortably in any pocket.',
        price: 75,
        rating: 4.7,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'color', label: 'Color', options: ['Brown', 'Black', 'Tan'] }
        ],
        specs: [
            { label: 'Material', value: 'Full-Grain Leather' },
            { label: 'Card Slots', value: '8' },
            { label: 'RFID Protection', value: 'Yes' },
            { label: 'Dimensions', value: '4.5" x 3.5" x 0.5"' }
        ]
    },
    {
        id: '18',
        name: 'Aviator Sunglasses',
        description: 'Classic aviator sunglasses with polarized lenses and lightweight metal frames. 100% UV protection.',
        price: 159,
        rating: 4.6,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'color', label: 'Lens Color', options: ['Green', 'Blue Mirror', 'Brown Gradient'] }
        ],
        specs: [
            { label: 'Frame', value: 'Lightweight Metal' },
            { label: 'Lens', value: 'Polarized Glass' },
            { label: 'UV Protection', value: '100% UVA/UVB' },
            { label: 'Includes', value: 'Leather Case + Cloth' }
        ]
    },
    {
        id: '19',
        name: 'Canvas Tote Bag',
        description: 'Durable organic cotton canvas tote with reinforced handles and interior pocket. Perfect for daily errands.',
        price: 45,
        rating: 4.4,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'color', label: 'Color', options: ['Natural', 'Black', 'Navy'] }
        ],
        specs: [
            { label: 'Material', value: 'Organic Cotton Canvas' },
            { label: 'Capacity', value: '15L' },
            { label: 'Closure', value: 'Magnetic Snap' },
            { label: 'Features', value: 'Interior Pocket, Reinforced Base' }
        ]
    },
    {
        id: '20',
        name: 'Stainless Steel Water Bottle',
        description: 'Double-wall vacuum insulated bottle keeps drinks cold 24hrs or hot 12hrs. Leak-proof lid with carry loop.',
        price: 35,
        rating: 4.8,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'color', label: 'Color', options: ['Matte Black', 'White', 'Ocean Blue', 'Rose Gold'] }
        ],
        specs: [
            { label: 'Capacity', value: '750ml / 25oz' },
            { label: 'Material', value: '18/8 Stainless Steel' },
            { label: 'Insulation', value: 'Cold 24hrs / Hot 12hrs' },
            { label: 'BPA Free', value: 'Yes' }
        ]
    },
    {
        id: '21',
        name: 'Automatic Chronograph Watch',
        description: 'Swiss-made automatic movement with sapphire crystal and exhibition caseback. Water resistant to 100m.',
        price: 2450,
        rating: 4.9,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'material', label: 'Strap', options: ['Leather', 'Stainless Steel', 'NATO'] }
        ],
        specs: [
            { label: 'Movement', value: 'Swiss Automatic' },
            { label: 'Crystal', value: 'Sapphire' },
            { label: 'Water Resistance', value: '100m' },
            { label: 'Case', value: '42mm Titanium' }
        ]
    },
    {
        id: '22',
        name: 'Travel Backpack 40L',
        description: 'Expandable carry-on backpack with laptop compartment, organization panels, and luggage pass-through.',
        price: 189,
        rating: 4.7,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1581605405669-fcdf81165bc0?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'color', label: 'Color', options: ['Black', 'Sage Green', 'Navy'] }
        ],
        specs: [
            { label: 'Capacity', value: '40L (expandable)' },
            { label: 'Laptop', value: 'Fits up to 16"' },
            { label: 'Material', value: 'Recycled Polyester' },
            { label: 'Carry-On', value: 'Yes (most airlines)' }
        ]
    },
    {
        id: '23',
        name: 'Ceramic Coffee Mug Set',
        description: 'Set of 4 handmade ceramic mugs with matte glaze finish. Microwave and dishwasher safe.',
        price: 48,
        rating: 4.5,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1572119865084-43c285814d63?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'color', label: 'Set Color', options: ['Earth Tones', 'Ocean Blues', 'Monochrome'] }
        ],
        specs: [
            { label: 'Capacity', value: '350ml / 12oz each' },
            { label: 'Material', value: 'Handmade Ceramic' },
            { label: 'Quantity', value: '4 mugs per set' },
            { label: 'Care', value: 'Microwave & Dishwasher Safe' }
        ]
    },
    {
        id: '24',
        name: 'Minimalist Desk Lamp',
        description: 'LED desk lamp with adjustable arm, touch dimming, and wireless charging base. Warm to cool light modes.',
        price: 79,
        rating: 4.6,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'color', label: 'Color', options: ['Matte Black', 'White', 'Walnut'] }
        ],
        specs: [
            { label: 'Light', value: 'LED (2700K - 6500K)' },
            { label: 'Dimming', value: 'Touch Control (5 Levels)' },
            { label: 'Charging', value: 'Qi Wireless + USB-C' },
            { label: 'Power', value: '12W' }
        ]
    },

    // ——— DIGITAL (6 products) ———
    {
        id: '25',
        name: 'Adobe Creative Cloud Annual',
        description: 'Full suite of 20+ creative apps including Photoshop, Illustrator, Premiere Pro, and After Effects.',
        price: 599,
        rating: 4.7,
        category: 'Digital',
        image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'license', label: 'Plan', options: ['Individual', 'Team (per user)', 'Student'] }
        ],
        specs: [
            { label: 'Apps', value: '20+ Creative Apps' },
            { label: 'Storage', value: '100GB Cloud Storage' },
            { label: 'Duration', value: '1 Year Subscription' },
            { label: 'Platforms', value: 'Windows + macOS' }
        ]
    },
    {
        id: '26',
        name: 'Spotify Premium Family Plan',
        description: 'Ad-free music streaming for up to 6 family members. Includes offline listening and Spotify Kids.',
        price: 179,
        rating: 4.8,
        category: 'Digital',
        image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'license', label: 'Plan', options: ['Individual', 'Duo', 'Family (6 users)'] }
        ],
        specs: [
            { label: 'Audio Quality', value: 'Up to 320kbps' },
            { label: 'Offline', value: 'Yes (up to 10,000 songs)' },
            { label: 'Duration', value: '1 Year' },
            { label: 'Devices', value: 'All platforms' }
        ]
    },
    {
        id: '27',
        name: 'Notion Pro Workspace',
        description: 'All-in-one workspace for notes, docs, projects, and wikis. Unlimited blocks and advanced permissions.',
        price: 96,
        rating: 4.6,
        category: 'Digital',
        image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'license', label: 'Plan', options: ['Personal Pro', 'Team', 'Enterprise'] }
        ],
        specs: [
            { label: 'Blocks', value: 'Unlimited' },
            { label: 'File Upload', value: 'Unlimited' },
            { label: 'Duration', value: '1 Year' },
            { label: 'API Access', value: 'Yes' }
        ]
    },
    {
        id: '28',
        name: 'Online Photography Course',
        description: 'Master photography from basics to advanced techniques. 40+ hours of HD video, RAW files, and presets included.',
        price: 199,
        rating: 4.5,
        category: 'Digital',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'license', label: 'Access', options: ['Lifetime Access', 'Monthly'] }
        ],
        specs: [
            { label: 'Content', value: '40+ Hours HD Video' },
            { label: 'Includes', value: '200+ RAW Files + Presets' },
            { label: 'Level', value: 'Beginner to Advanced' },
            { label: 'Certificate', value: 'Yes (on completion)' }
        ]
    },
    {
        id: '29',
        name: 'VPN Premium Annual',
        description: 'Fast, secure VPN with 5,500+ servers in 60 countries. No-logs policy and CyberSec threat protection.',
        price: 59,
        rating: 4.4,
        category: 'Digital',
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'license', label: 'Plan', options: ['1 Year', '2 Years', 'Monthly'] }
        ],
        specs: [
            { label: 'Servers', value: '5,500+ in 60 countries' },
            { label: 'Devices', value: '6 simultaneous' },
            { label: 'Protocol', value: 'NordLynx / OpenVPN' },
            { label: 'No-Logs', value: 'Verified by PwC audit' }
        ]
    },
    {
        id: '30',
        name: 'Cloud Storage 2TB Plan',
        description: 'Secure cloud storage with end-to-end encryption, file versioning, and automatic device sync across all platforms.',
        price: 99,
        rating: 4.5,
        category: 'Digital',
        image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800'
        ],
        isAvailable: true,
        variants: [
            { type: 'storage', label: 'Storage', options: ['200GB', '2TB', '6TB Family'] }
        ],
        specs: [
            { label: 'Storage', value: 'Up to 6TB' },
            { label: 'Encryption', value: 'End-to-End AES-256' },
            { label: 'Sync', value: 'All Devices' },
            { label: 'Duration', value: '1 Year' }
        ]
    }
];
