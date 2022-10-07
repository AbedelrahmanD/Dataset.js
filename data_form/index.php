<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>

  <style>
    body {
      /* direction: rtl; */
      font-family: sans-serif;
    }

    form {
      max-width: 500px;
      margin: auto;
    }

    button {
      border-radius: 3px;
      padding: 10px;
      width: 100%;
      margin: 15px 0;
      border: 1px solid #222;
    }

    .formContainer {
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .formContainer input {
      padding: 10px;
      border-radius: 3px;
      border: 1px solid #222;
    }

    .bg_image_container,
    .profile_image_container {
      width: 100px;
      height: 100px;
      background-color: #eee;
      background-image: url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHvSyIzSgje1VArO1EL9bnujvpOSR3Vrf1vlTjWJZzgrH7E_vu04SkgJroFpbxFg4o6Fs&usqp=CAU");
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      border-radius: 100%;
      cursor: pointer;
      position: relative;
      border: 5px solid white;
      box-shadow: 1px 1px 5px black;
      z-index: 1;

    }

    .bg_image_container img,
    .profile_image_container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 100%;
    }

    .profile_image_remove,
    .bg_image_remove {
      background-color: #f93154;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      position: absolute;
      top: 0;
      z-index: 5;
      cursor: pointer;
    }

    [data-invalid-message] {
      position: absolute;
      bottom: -20px;
      background-color: #F80C35;
      padding: 5px;
      border-radius: 3px;
      color: white;
      font-size: 0.8rem;
      font-weight: bold;
    }

    [data-invalid-message]::before {
      content: "\25B2";
      color: #F80C35;
      position: absolute;
      top: -12px;


    }
  </style>


</head>

<body>
  <h1>Form1- Post Method</h1>

  <form id="jsForm" action="api.php" method="POST" data-form-auto data-form="showAlert">
    <div class="formContainer" style="align-items: center;margin-bottom:2rem">
      <input type="file" name="profile_image" data-image data-type="text" data-type-message="Required">
    </div>

    <div class="formContainer">
      <label>Name</label>
      <input type="text" name="name" data-type="text" data-type-message="Required">
      <div data-error="nameRequired"></div>
    </div>
    <br>
    <div class="formContainer">
      <label>Email</label>
      <input type="email" name="email" data-type="email" data-type-message="Email Must Contains @ and .">
    </div>
    <br>
    <div class="formContainer">
      <label>Tel</label>
      <input type="tel" name="tel" value="96176368702" placeholder="ex: 961xxxxxxxx" data-type="tel" data-type-message="must be 961xxxxxxxx">
    </div>

    <button type="submit">submit</button>
    <div data-form-loader>loading...</div>
    <div data-form-message></div>
  </form>


  <hr>
  <h1>Form2- Get Method</h1>
  <form id="form2" action="api.php" method="GET" data-form>
    <div class="formContainer">
      <label>Number</label>
      <input type="text" name="name" data-number data-type="number" data-type-message="must be number">
    </div>
    <br>
    <div class="formContainer">
      <div data-type="radio" data-type-message="choose one">
        <input type="radio" name="ra" value="one">one
        <input type="radio" name="ra" value="two">two
      </div>
    </div>
    <button type="submit">submit</button>
    <div data-form-loader>loading...</div>
  </form>
  <script src="data_form.js"></script>
  <script src="data_form_rules.js"></script>

  <script>
    function showAlert(response) {
      alert(response.message);
    }
  </script>


</body>

</html>