<template>
  <div>
    <el-menu :default-active="$route.path" :router="true" class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item index="/clientes/index" route="/clientes/index">Ver Todos</el-menu-item>
      <el-menu-item index="/clientes/add" route="/clientes/add">Novo Cliente</el-menu-item>
    </el-menu>

    <div class="line"/>
    <el-table
      :data="tableData"
      style="width: 100%">

      <el-table-column
        prop="razao_social"
        label="Empresa"
        width="180"/>
      <el-table-column
        prop="cnpj"
        label="CNPJ"
        width="180"/>

      <el-table-column
        prop="name"
        label="Nome Cliente"
      />

      <el-table-column
        prop="cpf"
        label="CPF"
        width="180"/>

      <el-table-column
        prop="email"
        label="E-mail"
      />

      <el-table-column
        :formatter="(row, column, data_nascimento) => formatDate(row, column, data_nascimento)"
        prop="data_nascimento"
        label="Data Nascimento"/>

      <el-table-column
        prop="row"
        label="Ações"
        class="actions">
        <template slot-scope="row">
          <span class="actions">
            <el-button type="primary" icon="el-icon-edit" circle title="Editar Cliente" @click="getFormClient(row)"/>
            <el-button type="danger" icon="el-icon-delete" circle/>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="clienteFormVisible" title="Editar Cliente">
      <el-form ref="form" :model="form" label-width="180px">
        <el-form-item label="Tipo de Cliente">
          <el-radio-group v-model="form.tipo">
            <el-radio label="CPF">Pessoa Fisica</el-radio>
            <el-radio label="CNPJ">Pessoa Jurídica</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Nome Cliente">
          <el-col :span="16">
            <el-input v-model="form.name" required="true"/>
          </el-col>
        </el-form-item>
        <el-form-item label="CPF">
          <el-col :span="16">
            <el-input v-mask="'999.999.999-99'" v-model="form.cpf"/>
          </el-col>
        </el-form-item>
        <el-form-item v-show="form.tipo == 'CPF'" label="Data de Nascimento">
          <el-col :span="16">
            <el-date-picker v-mask="'99/99/9999'" v-model="form.data_nascimento" type="date" placeholder="Escolha uma data" style="width: 100%;" format="dd/MM/yyyy"/>
          </el-col>
        </el-form-item>
        <el-form-item v-show="form.tipo == 'CNPJ'" label="CNPJ">
          <el-col :span="16">
            <el-input v-mask="'99.999.999/9999-99'" v-model="form.cnpj"/>
          </el-col>
        </el-form-item>
        <el-form-item v-show="form.tipo == 'CNPJ'" label="Razão Social">
          <el-col :span="16">
            <el-input v-model="form.razao_social"/>
          </el-col>
        </el-form-item>
        <el-form-item label="E-mail">
          <el-col :span="16">
            <el-input v-model="form.email" type="email"/>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clienteFormVisible = false">Cancelar</el-button>
        <el-button type="primary" @click="saveCliente">Salvar</el-button>
      </span>
    </el-dialog>

  </div>

</template>

<script>
import AwesomeMask from 'awesome-mask'
import localForage from 'localforage'
import moment from 'moment'

export default {
  directives: {
    'mask': AwesomeMask
  },
  filters: {
    moment: function(date) {
      return moment(date).format('MMMM Do YYYY, h:mm:ss a')
    }
  },
  data() {
    return {
      clienteFormVisible: false,
      form: {},
      upHere: false,
      tableData: [],
      dataBR: 'DFSDFASDF'
    }
  },
  computed: {

  },
  mounted() {
    this.configLocalDB()
    this.getClientes()
  },
  methods: {
    saveCliente: function() {
      const self = this
      var id = this.form.cpf
      localForage.setItem(id, this.form).then(function() {
        // location.reload();
        // vm.$router.push({ path: '/clientes' })
        self.clienteFormVisible = false
        self.getClientes()
        self.form = {}
      })
    },
    getFormClient(row) {
      const id = row.row.cpf
      const self = this
      localForage.getItem(id).then(function(value) {
        // console.log(value);
        self.form = value
        self.clienteFormVisible = true
      }).catch(function(err) {
        console.log('ops', err)
      })
    },
    formatDate: function(row, column, date) {
      return moment(date).format('DD/MM/YYYY')
    },
    getClientes: function() {
      // [nome, razao_social, cnpj, cpf, data_nascimento, email]
      this.tableData = []
      var data = this.tableData
      localForage.iterate(function(value, key, iterationNumber) {
        data.push(value)
      }).then(function() {
        console.log('Iteration has completed')
      }).catch(function(err) {
        // This code runs if there were any errors
        console.log(err)
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
