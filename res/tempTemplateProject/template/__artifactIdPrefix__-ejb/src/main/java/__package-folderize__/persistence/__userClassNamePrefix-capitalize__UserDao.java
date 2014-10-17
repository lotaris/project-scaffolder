package {{ package }}.persistence;

import {{ package }}.model.{{ userClassNamePrefix | capitalize }}User;
import {{ package }}.model.QueryNames;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ejb.Stateless;
import javax.persistence.Query;

/**
 * @author {{ authorFirstName }} {{ authorLastName }} <{{ authorEmail }}>
 */
@Stateless
public class {{ userClassNamePrefix | capitalize }}UserDao implements I{{ userClassNamePrefix | capitalize }}UserDao {
	@PersistenceContext(unitName = "DataBasePersistenceUnit")
	private EntityManager em;

	@Override
	public void persist({{ userClassNamePrefix | capitalize }}User user) {
		em.persist(user);
	}

	@Override
	public {{ userClassNamePrefix | capitalize }}User findByEmail(String email) {
		Query query = em.createNamedQuery(QueryNames.{{ userClassNamePrefix | upper }}USER_FINDBYEMAIL);
		query.setParameter("email", email);
		return (DummyUser) query.getSingleResult();
	}
}
