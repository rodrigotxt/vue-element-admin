<template>
  <el-table v-loading="$parent.loading" :data="$parent.tableData" style="width: 100%">
    <el-table-column prop="id" label="ID" width="80" />
    <el-table-column prop="nome" label="Nome" />
    <el-table-column prop="especie.nome" label="Espécie" />
    <el-table-column prop="row" label="Ações" class="actions">
      <template slot-scope="row">
        <span class="actions">
          <el-button type="primary" icon="el-icon-edit" circle title="Editar Raça" @click="$parent.getForm(row)" />
          <el-button type="danger" icon="el-icon-delete" circle @click="$parent.removeItem(row.row)" />
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  methods: {

  }
}
</script>
