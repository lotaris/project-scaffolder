package {{ package }}.persistence;

import {{ package }}.model.{{ userClassNamePrefix | capitalize }}User;
import javax.ejb.Local;

/**
 * @see {{ userClassNamePrefix | capitalize }}User
 * @author {{ authorFirstName }} {{ authorLastName }} <{{ authorEmail }}>
 */
@Local
public interface I{{ userClassNamePrefix | capitalize }}UserDao {
	/**
	 * Persist a new user
	 */
	void persist({{ userClassNamePrefix | capitalize }}User user);

	/**
	 * Retrieves a {{ userClassNamePrefix | lower }} user by email address.
	 *
	 * @param email email address of the {{ userClassNamePrefix | lower }} user
	 * @return User if found, null otherwise.
	 */
	{{ userClassNamePrefix | capitalize }}User findByEmail(String email);
}
