package community.flock.eco.workday.mocks

import community.flock.eco.core.authorities.Authority
import community.flock.eco.feature.user.forms.UserAccountPasswordForm
import community.flock.eco.feature.user.model.User
import community.flock.eco.feature.user.services.UserAccountService
import community.flock.eco.feature.user.services.UserAuthorityService
import community.flock.eco.workday.authorities.ExpenseAuthority
import community.flock.eco.workday.authorities.HolidayAuthority
import community.flock.eco.workday.authorities.SickdayAuthority
import community.flock.eco.workday.authorities.WorkDayAuthority
import mocks.Role
import mocks.users
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.stereotype.Component

@Component
@ConditionalOnProperty(prefix = "flock.eco.workday", name = ["develop"])
class LoadUserData(
    private val userAccountService: UserAccountService,
    private val userAuthorityService: UserAuthorityService
) {
    val data: MutableSet<User> = mutableSetOf()

    val workerRoles = setOf(
        HolidayAuthority.READ,
        HolidayAuthority.WRITE,
        SickdayAuthority.READ,
        SickdayAuthority.WRITE,
        WorkDayAuthority.READ,
        WorkDayAuthority.WRITE,
        ExpenseAuthority.READ,
        ExpenseAuthority.WRITE
    )

    private val allAuthorities = userAuthorityService.allAuthorities()
    private val workerAuthorities = userAuthorityService.allAuthorities().filter { workerRoles.contains(it) }

    init {
        users.forEach { create(it) }
    }

    private final fun create(user: mocks.User) = UserAccountPasswordForm(
        name = user.firstName,
        email = "${user.firstName.toLowerCase()}@sesam.straat",
        password = user.firstName.toLowerCase(),
        authorities = user.authorities.map { it.toName() }.toSet()
    )
        .save()

    val mocks.User.authorities: List<Authority>
        get() {
            return when (role) {
                Role.ADMIN -> allAuthorities
                Role.USER -> workerAuthorities
            }
        }

    private fun UserAccountPasswordForm.save(): User =
        userAccountService.createUserAccountPassword(this)
            .user
            .also { data.add(it) }
}
