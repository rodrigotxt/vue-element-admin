<template>
  <el-dialog :visible.sync="formVisible" title="Editar">
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
      <el-button @click="formVisible = false">Cancelar</el-button>
      <el-button type="primary" @click="saveDados">Salvar</el-button>
    </span>
  </el-dialog>
</template>
