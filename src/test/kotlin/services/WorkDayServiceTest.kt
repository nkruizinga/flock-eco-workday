package community.flock.eco.workday.services

import community.flock.eco.workday.ApplicationConfiguration
import community.flock.eco.workday.forms.WorkDayForm
import community.flock.eco.workday.helpers.CreateHelper
import java.time.LocalDate
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.context.annotation.Import
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit4.SpringRunner

@RunWith(SpringRunner::class)
@ContextConfiguration(classes = [ApplicationConfiguration::class])
@DataJpaTest
@AutoConfigureTestDatabase
@Import(CreateHelper::class)
class WorkDayServiceTest {

    @Autowired
    lateinit var workDayService: WorkDayService

    @Autowired
    private lateinit var createHelper: CreateHelper

    @Test
    fun `creat update delete workday`() {

        val from = LocalDate.of(2020, 1, 1)
        val to = LocalDate.of(2020, 3, 31)
        val client = createHelper.createClient()
        val person = createHelper.createPerson()
        val assignment = createHelper.createAssignment(client, person, from, to)

        val createForm = WorkDayForm(
            from = from,
            to = to,
            assignmentCode = assignment.code,
            hours = 50
        )

        val created = workDayService.create(createForm)
        assertNotNull(created.id)
        assertEquals(50, created.hours)

        val updateForm = WorkDayForm(
            from = from,
            to = to,
            assignmentCode = assignment.code,
            hours = 25
        )
        val updated = workDayService.update(created.code, updateForm)
        assertNotNull(updated.id)
        assertEquals(25, updated.hours)
        assertEquals(created.code, updated.code)

        assertNotNull(workDayService.findByCode(created.code))

        workDayService.deleteByCode(created.code)

        assertNull(workDayService.findByCode(created.code))
    }
}
