package {{ package }}.persistence;

import javax.ejb.Local;

/**
 * DAO with generic methods applicable to all {@link IEntity} implementations.
 *
 * <p><strong>DO NOT USE THIS DAO!</strong> It is meant for generic validation use cases.</p>
 *
 * @author {{ authorFirstName }} {{ authorLastName }} <{{ authorEmail }}>
 */
@Local
public interface IGenericDao {
	/**
	 * Finds the entity with the specified type and key.
	 *
	 * <p><pre>
	 *	MyEntity entity = genericDao.<MyEntity>findByKey(MyEntity.class, "abcdefghij");
	 * </p></pre>
	 *
	 * @param <T> the entity type
	 * @param entityClass the entity class
	 * @param key the entity key
	 * @return the corresponding entity, or null if no entity was found with that key
	 */
	<T> T findByKey(Class<T> entityClass, String key);
}
