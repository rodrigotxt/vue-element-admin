/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const CadastrosRouter = {
  path: '/cadastros',
  component: Layout,
  redirect: 'noredirect',
  name: 'Cadastros',
  meta: {
    title: 'Cadastros',
    icon: 'form'
  },
  children: [
    {
      path: 'tinymce',
      component: () => import('@/views/components-demo/tinymce'),
      name: 'TinymceDemo',
      meta: { title: 'tinymce' }
    },
    {
      path: 'drag-kanban',
      component: () => import('@/views/components-demo/dragKanban'),
      name: 'DragKanbanDemo',
      meta: { title: 'dragKanban' }
    }
  ]
}

export default CadastrosRouter
