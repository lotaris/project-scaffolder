package {{ package }}.persistence;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

/**
 * @author {{ authorFirstName }} {{ authorLastName }} <{{ authorEmail }}>
 */
@Stateless
public class GenericDao implements IGenericDao {
	@PersistenceContext(unitName = "DataBasePersistenceUnit")
	private EntityManager em;

	@Override
	public <T> T findByKey(Class<T> entityClass, String key) {

		final Query query = em.createQuery("SELECT e FROM " + entityClass.getSimpleName() + " e WHERE e.key = :key");
		query.setParameter("key", key);

		try {
			return (T) query.getSingleResult();
		} catch (NoResultException e) {
			return null;
		}
	}
}
