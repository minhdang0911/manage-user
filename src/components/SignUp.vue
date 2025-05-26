<template>
  <div class="form-container">
    <div class="register">
      <h1>Sign up</h1>
      <input type="text" placeholder="Enter your name" v-model="form.name" />
      <input type="text" placeholder="Enter your Email" v-model="form.email" />
      <input type="password" placeholder="Enter your Password" v-model="form.password" />
      <button @click="SignUp()">Sign Up</button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: ''
      }
    };
  },
  methods: {
    SignUp() {
      console.log("Sign Up clicked", this.form);
      this.form.name = '';
      this.form.email = '';
      this.form.password = '';
    }
  }
}
</script>

<style scoped>
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f7f9fc;
}

.register {
  background: #ffffff;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.register h1 {
  margin-bottom: 10px;
  text-align: center;
  font-size: 28px;
  color: #333;
}

.register input {
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  transition: border 0.2s ease;
}

.register input:focus {
  border-color: #4f46e5;
  outline: none;
}

.register button {
  padding: 12px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.register button:hover {
  background-color: #3730a3;
}
</style>


