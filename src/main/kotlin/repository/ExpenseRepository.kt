package community.flock.eco.workday.repository

import community.flock.eco.workday.model.CostExpense
import community.flock.eco.workday.model.Expense
import community.flock.eco.workday.model.SickDay
import community.flock.eco.workday.model.TravelExpense
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.PagingAndSortingRepository
import org.springframework.stereotype.Repository
import java.util.Optional
import java.util.UUID

@Repository
interface ExpenseRepository : PagingAndSortingRepository<Expense, UUID>{
    fun findAllByPersonCode(personCode: String, pageable: Pageable): Page<Expense>
}

@Repository
interface TravelExpenseRepository : CrudRepository<TravelExpense, UUID>

@Repository
interface CostExpenseRepository : CrudRepository<CostExpense, UUID>