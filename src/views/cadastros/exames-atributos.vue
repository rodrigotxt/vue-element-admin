<template>
  <div>

    <el-form ref="form" :model="form" :rules="rules" label-width="120px">

      <!-- {{form}} -->
      <el-header class="bg-light">
        <legend class="p-3">Atributos do exame: <span class="text-muted">{{ form.exame.nome_exame }}</span></legend>
      </el-header>

      <el-main>
        <el-row>
          <el-col :span="8">
            <el-form-item label="Nome">
              <el-input v-model="form.nome" placeholder="Nome" required="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="Ordem">
              <el-input v-model="form.ordem" placeholder="Ordem" type="number" min="0"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="Tipo de Dado">
              <el-select v-model="form.tipo_dado" placeholder="Tipo de Dado" class="w-100">
                <el-option
                  v-for="item in config.tipo_dados"
                  :key="item"
                  :label="item"
                  :value="item"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="Unidade">
              <el-input v-model="form.unidade" placeholder="Unidade"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5">
            <el-form-item label="Atributo Pai">
              <el-select v-model="form.atributo_parent_id" placeholder="Atributo Pai">
                <el-option label="Nenhum" value=""/>
                <el-option
                  v-for="item in config.atributos"
                  :key="item.id"
                  :label="item.nome"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="Obrigatório" prop="obrigatorio">
              <el-switch v-model="form.obrigatorio"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-button type="primary" @click="saveDados">Salvar</el-button>
            <el-button type="secondary" @click="saveDados(true)">Salvar e Adicionar Outro</el-button>
          </el-col>
        </el-row>
      </el-main>

    </el-form>

    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        width="180"/>
      <el-table-column
        prop="nome"
        label="Nome"
        width="180"/>
      <el-table-column
        prop="tipo_dado"
        label="Tipo de Dado"
        width="180"/>
      <el-table-column
        prop="unidade"
        label="Unidade"
        width="180"/>
      <el-table-column
        label="Operations">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="editItem(scope.row)">Editar</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="removeItem(scope.row)">Apagar</el-button>
        </template>
      </el-table-column>
    </el-table>

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
  data() {
    return {
      tableData: [],
      form: {
        exame: {},
        obrigatorio: 1,
        ordem: 0
      },
      edit: false,
      tipo: '',
      name: '',
      id: '',
      config: {
        atributos: {},
        tipo_dados: ['Alfanúmerico', 'Data', 'Decimal', 'Caixa de Texto', 'Texto', 'Inteiro']
      },
      localDB: '',
      appURL: 'http://zoom.local/',
      rules: {
        nome: [
          { required: true, message: 'Digite um nome', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {},
  mounted() {
    this.tipo = this.$route.path
    this.form.exame = this.$route.params
    if (!this.form.exame.exame_id) { // se não tiver os parametros, voltar página anterior
      history.go(-1)
    }
    this.getAtributosPai()
  },
  methods: {
    editItem(row) {
      this.edit = true
      var exame = {}
      exame = this.form.exame
      this.form = row
      this.form.exame = exame
    },
    removeItem(row) {
      const self = this
      var id = row.id
      var r = confirm('Deseja excluir?')
      if (!r) {
        return false
      }
      self.loading = true
      axios.delete(self.appURL + 'atributos-exames' + '/' + id).then(function(response) {
        self.getAtributosPai()
      }).catch(function(error) {
        console.log(error)
      }).finally(function() {
        self.loading = false
      })
    },

    getAtributosPai: function() {
      const self = this
      var exame_id = this.form.exame.exame_id
      axios.get(self.appURL + 'atributos-exames?exame_id=' + exame_id)
        .then(function(response) {
          self.config.atributos = response.data
          self.tableData = response.data
        }).catch(function(error) {
          error => console.log(error)
        }).finally(
          function() {

          }
        )
    },
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
    saveDados: function(refresh = false) {
      const self = this

      self.$refs['form'].validate((valid) => {
        if (valid) {
          var id = ''
          if (self.edit) {
            var method = 'put'
            var id = '/' + self.form.id
          } else {
            var method = 'post'
          }
          axios({
            method: method,
            url: this.appURL + this.tipo + id,
            data: this.form
          })
            .then(function(response) {
              self.form = {}
              if (refresh) {
                self.$router.push({ path: self.$route.path })
              }
              var pathRoute = '/cadastros/index/exames'
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
            .finally(f => (self.edit = false))
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
