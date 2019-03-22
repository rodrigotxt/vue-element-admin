<template>
  <div>
    <el-menu :default-active="$route.path" :router="true" class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item :index="'/cadastros/index/'+tipoCadastro" :route="'/cadastros/index/'+tipoCadastro">Ver Todos</el-menu-item>
      <el-menu-item :index="'/cadastros/add/'+tipoCadastro" :route="'/cadastros/add/'+tipoCadastro">Novo Cadastro</el-menu-item>
    </el-menu>

    <div class="line"/>
    <tabela-cliente v-if="$route.params.tipo == 'clientes'"/>
    <tabela-especie v-if="$route.params.tipo == 'especies'"/>
    <tabela-raca v-if="$route.params.tipo == 'racas'"/>

    <el-dialog :visible.sync="formVisible" title="Editar">
      <form-especies v-if="$route.params.tipo == 'especies'" :form="form"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">Cancelar</el-button>
        <el-button type="primary" @click="saveDados">Salvar</el-button>
      </span>
    </el-dialog>

  </div>

</template>

<script>
import tabelaCliente from './tabelas/cliente'
// import tabelaPadrao from './tabelas/padrao'
import tabelaEspecie from './tabelas/especie.vue'
import tabelaRaca from './tabelas/raca.vue'

/** * Formularios ***/
import formEspecie from './forms/especies.vue'
import formCliente from './forms/clientes.vue'

import AwesomeMask from 'awesome-mask'
import localForage from 'localforage'
import moment from 'moment'

export default {
  name: 'CadastrosIndex',
  directives: {
    'mask': AwesomeMask
  },
  filters: {
    moment: function(date) {
      return moment(date).format('MMMM Do YYYY, h:mm:ss a')
    }
  },
  components: {
    'tabela-cliente': tabelaCliente,
    'tabela-especie': tabelaEspecie,
    'tabela-raca': tabelaRaca,
    'form-especies': formEspecie,
    'form-cliente': formCliente
  },
  // props: ['tipoCadastro'],
  data() {
    return {
      formVisible: false,
      form: {},
      localDB: '',
      upHere: false,
      tableData: [],
      dataBR: 'DFSDFASDF',
      loading: false,
      tipoCadastro: ''
    }
  },
  computed: {

  },
  mounted() {
    this.tipoCadastro = this.$route.params.tipo
    this.configLocalDB()
    this.getDados()
  },
  methods: {
    configLocalDB() {
      this.localDB = localForage.createInstance({
        name: 'cadastros',
        storeName: this.tipoCadastro
      })
      // localForage.config({
      //   name: 'cadastros',
      //   storeName: this.tipoCadastro
      // })
    },
    saveDados: function() {
      const self = this
      var id = this.form.id
      self.localDB.setItem(id, this.form).then(function() {
        // location.reload();
        // vm.$router.push({ path: '/clientes' })
        self.formVisible = false
        self.getDados()
        self.form = {}
      })
    },
    removeItem(row) {
      const self = this
      var id = row.id
      var r = confirm('Deseja excluir?')
      if (!r) {
        return false
      }

      // return false;
      self.localDB.removeItem(id).then(function() {
        // location.reload();
        // vm.$router.push({ path: '/clientes' })
        self.formVisible = false
        self.getDados()
        self.form = {}
      })
    },
    getForm(row = null, isNew = null) {
      const self = this
      const id = row.row.id
      self.localDB.getItem(id).then(function(value) {
        if (isNew) {
          self.form = []
        } else {
          self.form = value
        }
        self.formVisible = true
      }).catch(function(err) {
        console.log('ops', err)
      })
    },
    formatDate: function(row, column, date) {
      return moment(date).format('DD/MM/YYYY')
    },
    getDados: function() {
      // [nome, razao_social, cnpj, cpf, data_nascimento, email]
      console.log('getDados...')
      var self = this
      this.loading = true
      this.tableData = []
      var data = this.tableData
      self.localDB.iterate(function(value, key, iterationNumber) {
        data.push(value)
      }).then(function() {
        console.log('Iteration has completed', data)
        self.loading = false
      }).catch(function(err) {
        // This code runs if there were any errors
        console.log(err)
      })
    }
  }
}
</script>
