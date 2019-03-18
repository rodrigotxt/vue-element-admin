<template>
  <div>
    <el-menu :default-active="$route.path" :router="true" class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item index="/clientes/index" route="/clientes/index">Ver Todos</el-menu-item>
      <el-menu-item index="/clientes/add" route="/clientes/add">Novo Cliente</el-menu-item>
    </el-menu>

    <el-main>
      <h2>Inserir Novo Cliente</h2>
      <el-form ref="form" :model="form" label-width="180px">
        <el-form-item label="Tipo de Cliente">
          <el-radio-group v-model="form.tipo">
            <el-radio label="CPF">Pessoa Fisica</el-radio>
            <el-radio label="CNPJ">Pessoa Jurídica</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Nome Cliente">
          <el-col :span="6">
            <el-input v-model="form.name" required="true"/>
          </el-col>
        </el-form-item>
        <el-form-item label="CPF">
          <el-col :span="6">
            <el-input v-mask="'999.999.999-99'" v-model="form.cpf"/>
          </el-col>
        </el-form-item>
        <el-form-item v-show="form.tipo == 'CPF'" label="Data de Nascimento">
          <el-col :span="6">
            <el-date-picker v-mask="'99/99/9999'" v-model="form.data_nascimento" type="date" placeholder="Escolha uma data" style="width: 100%;" format="dd/MM/yyyy"/>
          </el-col>
        </el-form-item>
        <el-form-item v-show="form.tipo == 'CNPJ'" label="CNPJ">
          <el-col :span="6">
            <el-input v-mask="'99.999.999/9999-99'" v-model="form.cnpj"/>
          </el-col>
        </el-form-item>
        <el-form-item v-show="form.tipo == 'CNPJ'" label="Razão Social">
          <el-col :span="6">
            <el-input v-model="form.razao_social"/>
          </el-col>
        </el-form-item>
        <el-form-item label="E-mail">
          <el-col :span="6">
            <el-input v-model="form.email" type="email"/>
          </el-col>
        </el-form-item>
        <el-button size="large" type="success" @click="saveCliente">Salvar</el-button>
      </el-form>

    </el-main>
  </div>
</template>

<script>

import AwesomeMask from 'awesome-mask'
import localForage from 'localforage'

export default {
  name: 'AddCliente',
  components: {

  },
  directives: {
    'mask': AwesomeMask
  },
  data() {
    return {
      form: {}
    }
  },
  watch: {
    //   form:{
    //     handler(form){
    //     // localStorage.setItem('testObject', JSON.stringify(data));
    //     // localStorage.form = JSON.stringify(this.form);
    //     localStorage.setItem("form",JSON.stringify(this.form));
    //   },
    //   deep: true
    // },
  },
  mounted() {
    this.configLocalDB()
    // if (localStorage.getItem('form')) this.form = JSON.parse(localStorage.getItem('form'));
  },
  methods: {
    saveCliente: function() {
      const vm = this
      var id = this.form.cpf
      localForage.setItem(id, this.form).then(function() {
        vm.form = {}
        vm.$router.push({ path: './index' })
      })
    },
    configLocalDB() {
      localForage.config({
        name: 'clientes',
        storeName: 'cliente'
      })
    }
  }
}
</script>
