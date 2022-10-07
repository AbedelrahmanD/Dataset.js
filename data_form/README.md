<h1>DataForm.JS</h1>
<p>This plugin allows you to handle form operations through html datasets attributes instead of writing javascript</p>
<p>You can validate form, send ajax request, show loader, handle backend response like showing message or redirecting to another page. All of this without writing javascript and it is independed of the number of forms and inputs</p>
<h1>Instalation</h1>
<p>Include <code>data_form.js</code> script</p>

```
<script src="data_form.js"></script>
```

<h1>Usage</h1>
<p>Create a form and give it <code>id</code>, <code>method</code> and <code>action</code>, then add 
<code>data-form</code>, that's it. Now if you submit the form it will send http request to the specified action url with all form inputs</p>

<h3>Note: inputs should have name attribute or they will not be sent with the http request</h3>

```
 <form id="jsForm" action="api.php" method="POST" data-form></form>
```

<h1>Show Loader</h1>
<p>Create any element that you want to show until the http request is done and add the attribure <code>data-form-loader</code> </p>


<h3>Note: The element must be inside the form inorder to work</h3>

```
 <form id="jsForm" action="api.php" method="POST" data-form>
    <div data-form-loader>loading...</div>
 </form>
```

<h1>Handle Bakcend Response</h1>
<p>The response must be json encoded, if it contains <code>message</code> key, you can show it by creating element and give it attribute <code>data-form-messae</code>, if you want to redirect user to another page the backend must have key <code>redirect</code></p>
<h3>Note: The elements must be inside the form inorder to work</h3>

```
 <form id="jsForm" action="api.php" method="POST" data-form>
   <div data-form-message></div>
 </form>
```

<h3>api.php</h3>

```
$response["message"]="success";
$response["redirect"]="login.php";
echo json_encode($response);

```

<h1>Call Custom Function</h1>
<p>To call custom function after http request done, specify the function name with <code>data-form</code></p>

```
  <form id="jsForm" action="api.php" method="POST" data-form="showAlert">
 </form>
 <script>
      function showAlert(response) {
          alert(response.message);
      }
 </script>
```


<h1>Validation</h1>
<p>Use <code>data-type</code> and <code>data-type-message</code> to validate the type of the input and sow message if its not valid</p>
<p>See more details <a target="_blank" href="https://github.com/AbedelrahmanD/Auto-Form-Validation.JS">here</a></p>

```
 <form id="jsForm" action="api.php" method="POST" data-form>
   <input type="text" name="name" data-type="text" data-type-message="Required">
   <input type="email" name="email" data-type="email" data-type-message="Email must contains @ and .">
<input type="submit" value="submit">
 </form>
```

<h1>Add New Validation Rule</h1>
<p>Add new rules to <code>formRules</code> global variable</p>

```
 <script>
        //length must be minimum 3
        formRules["min3"] = function(value) {
            return value.length >= 3;
        }
</script>
<form id="jsForm" action="api.php" method="POST" data-form>
   <input type="text" name="name" data-type="min3" data-type-message="Must Be Minimum 3 Letters">
   <input type="submit" value="submit">
 </form>
```



