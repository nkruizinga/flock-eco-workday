package community.flock.eco.holidays.services

import community.flock.eco.feature.user.model.User
import community.flock.eco.holidays.forms.HolidayForm
import community.flock.eco.holidays.model.DayOff
import community.flock.eco.holidays.model.DayType
import community.flock.eco.holidays.model.Holiday
import community.flock.eco.holidays.repository.HolidayRepository
import org.springframework.stereotype.Service
import java.time.Period


@Service
class HolidayService(
        val holidayRepository: HolidayRepository) {

    fun create(form: HolidayForm, user: User): Holiday {
        form.validate()
        return Holiday(
                description = form.description,
                from = form.from,
                to = form.to,
                dayOff = form.dayOff.mapIndexed { index, hours ->
                    DayOff(
                            type = DayType.HOLIDAY,
                            date = form.from.plusDays(index.toLong()),
                            hours = hours
                    )
                }.toSet(),
                user = user)
                .save()
    }

    fun update(id: Long, form: HolidayForm) {
        form.validate()
    }

    private fun Holiday.save() = holidayRepository
            .save(this)

    private fun HolidayForm.validate() {
        val daysBetween = Period.between(this.from, this.to).days + 1
        if (this.dayOff.size != daysBetween) {
            throw RuntimeException("amount of DayOff not equal to period")
        }
    }
}