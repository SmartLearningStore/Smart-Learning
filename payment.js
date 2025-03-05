const API_KEY = 'DSW0zVqt5HL46PHddqxmOndBpWVrQPvDPJ4uCa4armbj1fSjAFAmssCRsTPjkDX9';
const API_SECRET = 'keJ5T8bWp62o22ntNpR2ND386hQqhT1GVLDw0EZLqe9ZasdbIJppx8MS4Usst85T';
const BINANCE_USDT_ADDRESS = 'TCzSfcTu5Ch8ZxNeNXoL1ZanKPkCARz441';

document.getElementById('paymentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const loadingElement = document.getElementById('loading');

    if (cardNumber && expiryDate && cvv) {
        loadingElement.classList.remove('hidden'); // Show loading text

        makePayment(cardNumber, expiryDate, cvv, email);
    } else {
        alert("Please fill in all the fields.");
    }
});

function makePayment(cardNumber, expiryDate, cvv, email) {
    fetch('https://payment-api.com/charge', {  
        method: 'POST',  
        headers: {  
            'Content-Type': 'application/json',  
            'Authorization': `Bearer ${API_KEY}`  
        },  
        body: JSON.stringify({  
            cardNumber: cardNumber,  
            expiryDate: expiryDate,  
            cvv: cvv,  
            apiSecret: API_SECRET,  
            amount: 50,  
            usdtAddress: BINANCE_USDT_ADDRESS  
        })  
    })
    .then(response => response.json())
    .then(data => {  
        document.getElementById('loading').classList.add('hidden'); // Hide loading

        if (data.success) {  
            alert("✅ Payment Successful!");  
            sendToTelegram(email, data.orderDetails);  
        } else {  
            alert("❌ Payment failed. Try again.");  
        }  
    })  
    .catch(error => {  
        console.error("Payment error:", error);
        alert("⚠️ Error processing your payment.");
    });  
}

function sendToTelegram(email, orderDetails) {  
    const TELEGRAM_BOT_TOKEN = "7590766158:AAFTMfMpGQkg_4iw3UyOiGX4NdarPIvcwRE";  
    const TELEGRAM_CHAT_ID = "6807445600";  

    const message = `  
        🛒 New Order Received!  
        📦 Product: ${orderDetails.productName}  
        💰 Price: ${orderDetails.price}  
        📩 Email: ${email}  
    `;  

    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {  
        method: 'POST',  
        headers: { 'Content-Type': 'application/json' },  
        body: JSON.stringify({  
            chat_id: TELEGRAM_CHAT_ID,  
            text: message  
        })  
    })
    .then(response => response.json())  
    .then(data => console.log("✅ Telegram message sent:", data))  
    .catch(error => console.error("❌ Error sending Telegram message:", error));  
}

// Format expiry date as MM\YY
document.getElementById('expiryDate').addEventListener('input', function(event) {
    let value = event.target.value.replace(/\D/g, ''); // Keep only digits
    if (value.length > 2) {
        value = value.substring(0, 2) + '\\' + value.substring(2, 4);
    }
    event.target.value = value;
});
