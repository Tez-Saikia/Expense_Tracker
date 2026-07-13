import React from 'react'
import BudgetList from './_components/BudgetList'

function Budget() {
  return (
    <div className='p-10'>
      <h1 className='font-bold text-3xl'>My Budgets</h1>
      <BudgetList/>
    </div>
  )
}

export default Budget