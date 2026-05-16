(() => {

    const originalHTML = document.documentElement.outerHTML;

 
    document.open();
    document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Educational Keyword Guide</title>
<style>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    background:#f5f5f5;
    color:#333;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;
    display:flex;
    align-items:center;
    justify-content:center;
    height:100vh;
    overflow:hidden;
}

.wrap{
    text-align:center;
    animation:fade .15s ease;
}

h1{
    font-size:42px;
    margin-bottom:12px;
    color:#2c3e50;
}

p{
    font-size:18px;
    color:#666;
}

.loader{
    width:60px;
    height:60px;
    border:5px solid #ddd;
    border-top:5px solid #2c3e50;
    border-radius:50%;
    margin:30px auto 0;
    animation:spin .5s linear infinite;
}

@keyframes spin{
    to{
        transform:rotate(360deg);
    }
}

@keyframes fade{
    from{
        opacity:0;
        transform:translateY(10px);
    }
    to{
        opacity:1;
        transform:translateY(0);
    }
}
</style>
</head>
<body>
<div class="wrap">
    <h1>Educational Keyword Guide</h1>
    <p>Loading academic resources...</p>
    <div class="loader"></div>
</div>
</body>
</html>
    `);
    document.close();


    setTimeout(() => {

        document.open();
        document.write(originalHTML);
        document.close();
    }, 100);
})();
