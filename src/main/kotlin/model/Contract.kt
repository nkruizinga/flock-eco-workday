package community.flock.eco.workday.model

import community.flock.eco.core.model.AbstractCodeEntity
import community.flock.eco.workday.interfaces.Period
import java.time.LocalDate
import java.util.UUID
import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.Inheritance
import javax.persistence.InheritanceType
import javax.persistence.ManyToOne

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
abstract class Contract(

    override val id: Long = 0,
    override val code: String = UUID.randomUUID().toString(),

    override val from: LocalDate,
    override val to: LocalDate?,

    @ManyToOne
    open val person: Person?,

    @Enumerated(EnumType.STRING)
    open val type: ContractType

) : Period, AbstractCodeEntity(id, code) {

    //TODO Add fucntion signatures here of Internal/External
    fun totalHoursPerWeek() = when (this) {
        is ContractInternal -> this.hoursPerWeek
        is ContractExternal -> this.hoursPerWeek
        is ContractManagement -> 40
        else -> error("Unknown contract type")
    }
}
