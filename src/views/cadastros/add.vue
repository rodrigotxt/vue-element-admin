<template>
  <div>
    <el-menu :default-active="$route.path" :router="true" class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item :index="'/cadastros/index/'+tipo" :route="'/cadastros/index/'+tipo">Ver Todos</el-menu-item>
      <el-menu-item :index="'/cadastros/add/'+tipo" :route="'/cadastros/add/'+tipo">Novo Cadastro</el-menu-item>
    </el-menu>
    <el-main>
      <h2>Inserir Novo</h2>
      <el-form v-if="tipo == 'especies'" ref="form" :rules="rulesEspecie" :model="form" label-width="180px">
        <el-form-item label="Nome da Espécie" prop="nome">
          <el-col :span="6">
            <el-input v-model="form.nome" required="true" @keyup.enter.native="saveDados" />
          </el-col>
        </el-form-item>
        <el-button size="large" type="success" @click="saveDados">Salvar</el-button>
      </el-form>
      <el-form v-if="tipo == 'racas'" ref="form" :model="form" label-width="180px">
        <el-form-item label="Nome da Raça">
          <el-col :span="6">
            <el-input v-model="form.nome" required="true" @focus="getEspecies()" />
          </el-col>
        </el-form-item>
        <el-form-item v-if="config.especies" label="Espécie">
          <el-select v-model="form.especie_id" placeholder="selecione uma espécie">
            <el-option v-for="(especie, index) in config.especies" :key="index" :label="especie.nome" :value="especie.id" />
          </el-select>
        </el-form-item>
        <el-button size="large" type="success" @click="saveDados">Salvar</el-button>
      </el-form>
      <el-form v-if="tipo == 'pelagens'" ref="form" :model="form" label-width="180px">
        <el-form-item label="Nome da Espécie">
          <el-col :span="6">
            <el-input v-model="form.name" required="true" />
          </el-col>
        </el-form-item>
        <el-button size="large" type="success" @click="saveDados">Salvar</el-button>
      </el-form>
    </el-main>
  </div>
</template>
<script>
// var especies = ['Avícola', 'Bovinos', 'Canina', 'Cunícula', 'Equina', 'Exótico', 'Felina', 'Outras', 'Primatas', 'Roedor']

import AwesomeMask from 'awesome-mask'
import localForage from 'localforage'
import axios from 'axios'

export default {
  name: 'AddCadastro',
  components: {

  },
  directives: {
    'mask': AwesomeMask
  },
  props: ['tipoCadastro'],
  data() {
    return {
      form: {},
      tipo: '',
      name: '',
      id: '',
      config: {},
      localDB: '',
      appURL: 'http://zoom.local/',
      rulesEspecie: {
        nome: [
          { required: true, message: 'Digite um nome', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {},
  mounted() {
    this.tipo = this.$route.params.tipo
    this.name = 'cadastros' // this.$route.name;
    this.configLocalDB()
    // if (localStorage.getItem('form')) this.form = JSON.parse(localStorage.getItem('form'));
  },
  methods: {
    configLocalDB() {
      const self = this
      var localDB = localForage.createInstance({
        name: self.name,
        storeName: self.tipo
      })
      localDB.length().then((nKeys) => { self.id = ++nKeys })
      self.localDB = localDB
    },
    getEspecies: function() {
      const self = this
      this.loading = true
      axios.get(self.appURL + 'especies')
        .then(
          function(response) {
            var especies = response.data
            self.config.especies = especies
          })
        .catch(function(error) {
          console.log(error)
        })
        .finally(() => (this.loading = false))
      /*
      var EspeciesDB = localForage.createInstance({
        name: 'cadastros',
        storeName: 'especies'
      })

      var especies = []

      this.loading = true
      EspeciesDB.iterate(function(value, key, iterationNumber) {
        especies.push(value)
      }).then(function() {
        self.config.especies = especies
        self.loading = false
      }).catch(function(err) {
        // This code runs if there were any errors
        console.log(err)
      })
      */
    },
    saveDados: function() {
      const self = this
      // var id = this.id
      // self.form.id = id

      self.$refs['form'].validate((valid) => {
        if (valid) {
          axios.post(this.appURL + this.tipo, this.form)
            .then(function(response) {
              self.form = {}
              var pathRoute = '/cadastros/index/' + self.tipo
              // console.log(pathRoute);
              self.$router.push({ path: pathRoute })
            })
            .catch(function(error) {
              // alert('ocorreu um erro:'+response);
              // console.log(error.response.data.errorInfo[2]);
              if (error) {
                self.$alert('Ocorreu um erro ao inserir os dados.', 'Oops', { type: 'error', confirmButtonText: 'OK' })
              }
              // self.$notify.error({
              //   title: 'Oops',
              //   message: 'Ocorreu um erro ao inserir os dados'
              // });
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })

      return false

      /* save on localDB
      // const self = this
      var id = this.id
      self.form.id = id
      self.localDB.setItem(id, self.form).then(function() {
        self.form = {}
        var pathRoute = '/cadastros/index/' + self.tipo
        // console.log(pathRoute);
        self.$router.push({ path: pathRoute })
      })
      */
    }
  }
}

</script>
