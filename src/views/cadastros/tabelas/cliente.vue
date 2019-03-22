<template>
  <el-table
    v-loading="$parent.loading"
    :data="$parent.tableData"
    style="width: 100%"
  >

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
      :formatter="(row, column, data_nascimento) => $parent.formatDate(row, column, data_nascimento)"
      prop="data_nascimento"
      label="Data Nascimento"/>

    <el-table-column
      prop="row"
      label="Ações"
      class="actions">
      <template slot-scope="row">
        <span class="actions">
          <el-button type="primary" icon="el-icon-edit" circle title="Editar Cliente" @click="$parent.getForm(row)"/>
          <el-button type="danger" icon="el-icon-delete" circle/>
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>
