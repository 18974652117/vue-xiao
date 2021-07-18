<template>
  <div class="login_container">
    <div class="login_box">
      <div class="image">
        <img src="../../assets/logo.png" alt="">
      </div>

       <!-- 登录表单区域 ref：获取组件实例对象 或 表单引用对象。 rules：验证规则。 :model：属性绑定。 -->
      <el-form ref="ruleForm" :rules="rulesLogin" :model="loginForm">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" >
            <i slot="prefix" class="el-icon-user-solid"></i>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password">
            <i slot="prefix" class="el-icon-s-goods"></i>
          </el-input>
        </el-form-item>

        <el-form-item class="btn">
          <el-button type="primary" @click="subimtLgoin">登录</el-button>
          <el-button type="info" @click="resetFrom">重置</el-button>
        </el-form-item>
        
      </el-form>
    </div>
  </div>
</template>

<script>
import { getLogin } from '../../api/index'
export default {
  name: 'login',      // 登录页
  data(){
    return {

      // 登录表单数据绑定对象
      loginForm: {
        username: "admin",
        password: "123456",
      },

      rulesLogin: {
          username: [ { required: true, message: '请输入用户名', trigger: 'blur' },
                  { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' } ],

          password: [ { required: true, message: '请输入密码', trigger: 'blur' },
                  { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' } ],
            
        }
    }
  },

  methods: {
    /**
     *  登录 
     */  
    subimtLgoin(){

      // validate: 表单预验证
      this.$refs.ruleForm.validate( async valid =>{
        if(!valid){ return };
        // console.log(valid);     // true 就是通过预验证
        let {data:res} =  await getLogin(this.loginForm.username , this.loginForm.password);
        console.log(res);

        if(res.meta.status !== 200){
          return this.$message.error('登录失败');
        }else{
          this.$message({  message: '恭喜你,登录成功', type: 'success' });
        }

        // 1: 将登录成功之后的 token 保存到客户端 localStorage
        window.sessionStorage.setItem('token',res.data.token);
        
        this.$router.push('./home');
      })
    },

    /**
     *  重置   
     */ 
    resetFrom() {
      // $refs: 是一个数据对象  
      this.$refs.ruleForm.resetFields();
    },
  }
}
</script>

<style lang="scss" scoped>

.login_container{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #2b4b6b;
  
  .login_box{
    width: 400px;
    height: 300px;
    position: relative;
    background-color: #fff;

    .image {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%,-50%);
      width: 100px;
      height: 100px;
      padding: 10px;
      border-radius: 50%;
      box-shadow: 0 0 10px #ddd;
      background-color: #fff;

      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }

    .el-form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 20px 30px;
      box-sizing:border-box ;

      .btn{
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>