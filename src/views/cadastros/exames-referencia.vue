<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <!-- {{form}} -->
      <el-header class="bg-light">
        <legend class="p-3">Referências do Exame: <span class="text-muted">{{ form.exame.nome_exame }}</span></legend>
      </el-header>

      <el-main>
        <el-row>
          <el-button v-for="r in referencias" :key="r.id" plain>{{ r.especie.nome }}: {{ r.nome }}</el-button>
        </el-row>
        <hr>
        <el-row>
          <el-col :span="8">
            <el-form-item label="Nome">
              <el-input v-model="form.nome" placeholder="Nome" required="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Exame">
              <el-input v-model="form.exame.nome_exame" placeholder="Exame" type="text" disabled min="0"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5">
            <el-form-item label="Espécie">
              <el-select v-model="form.especie_id" placeholder="Espécie">
                <el-option
                  v-for="item in config.especies"
                  :key="item.id"
                  :label="item.nome"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="Idade Inicial">
              <el-input v-model="form.idade_inicial" type="number" min="0" placeholder="0">
                <template slot="append">meses</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="Idade Final">
              <el-input v-model="form.idade_final" type="number" min="0" placeholder="24">
                <template slot="append">meses</template>
              </el-input>
            </el-form-item>
          </el-col>

        </el-row>
      </el-main>

    </el-form>

    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="nome"
        label="Atributo"
        width="180"/>

      <el-table-column
        prop="nome"
        label="Referência Inicio"
        width="180">
        <template slot-scope="scope">
          <el-input v-model="scope.row.referencia_inicio" placeholder=""/>
        </template>
      </el-table-column>

      <el-table-column
        prop="nome"
        label="Referência Fim"
        width="180">
        <template slot-scope="scope">
          <el-input v-model="scope.row.referencia_fim" placeholder=""/>
        </template>
      </el-table-column>

      <el-table-column
        prop="unidade"
        label="Unidade"
        width="120"/>

      <el-table-column
        prop="complemento"
        label="Complemento"
        width="250">
        <template slot-scope="scope">
          <el-input v-model="scope.row.complemento" placeholder=""/>
        </template>
      </el-table-column>

    </el-table>

    <el-row>
      <el-col>
        <el-button type="primary" @click="saveDados">Salvar</el-button>
      </el-col>
    </el-row>

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
      referencias: [],
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
    this.getReferencias()
    this.getEspecies()
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
    getEspecies: function() {
      const self = this
      // var exame_id = this.form.exame.exame_id
      axios.get(self.appURL + 'especies')
        .then(function(response) {
          self.config.especies = response.data
        }).catch(function(error) {
          console.log(error)
        }).finally(
          function() {

          }
        )
    },
    getReferencias: function() {
      const self = this
      var exame_id = this.form.exame.exame_id
      axios.get(self.appURL + 'cadastros/exames/referencias?exame_id=' + exame_id)
        .then(function(response) {
          self.referencias = response.data
        }).catch(function(error) {
          console.log(error)
        }).finally(
          function() {

          }
        )
    },
    getAtributosPai: function() {
      const self = this
      var exame_id = this.form.exame.exame_id
      axios.get(self.appURL + 'atributos-exames?exame_id=' + exame_id)
        .then(function(response) {
          self.config.atributos = response.data
          self.tableData = response.data
        }).catch(function(error) {
          console.log(error)
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
    saveDados: function(refresh = false) {
      const self = this

      self.$refs['form'].validate((valid) => {
        if (valid) {
          if (self.edit) {
            var method = 'put'
            var id = '/' + self.form.id
          } else {
            var method = 'post'
          }
          self.form.atributos = self.config.atributos
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
