package community.flock.eco.workday.repository

import community.flock.eco.workday.model.Contract
import community.flock.eco.workday.model.ContractType
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.PagingAndSortingRepository
import org.springframework.stereotype.Repository
import java.time.LocalDate
import java.util.Optional
import java.util.UUID

@Repository
interface ContractRepository : PagingAndSortingRepository<Contract, Long> {
    fun findByCode(code: String): Optional<Contract>
    fun findAllByPersonUuid(personUuid: UUID, page: Pageable): Page<Contract>
    fun findAllByPersonUserCode(userCode: String, page: Pageable): Page<Contract>
    fun deleteByCode(code: String)
    fun findAllByType(internal: ContractType): Iterable<Contract>
    fun findAllByToBetween(start: LocalDate?, end: LocalDate?): Iterable<Contract>
}
