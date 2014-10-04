package {{ package }}.service;

import {{ package }}.model.{{ userClassNamePrefix | capitalize }}User;
import {{ package }}.persistence.I{{ userClassNamePrefix | capitalize }}UserDao;
import javax.ejb.EJB;
import javax.ejb.Stateless;

/**
 * @author {{ authorFirstName }} {{ authorLastName }} <{{ authorEmail }}>
 */
@Stateless
public class {{ userClassNamePrefix | capitalize }}UserService implements I{{ userClassNamePrefix | capitalize }}UserService {

	@EJB
	private I{{ userClassNamePrefix | capitalize }}UserDao userDao;

	@Override
	public {{ userClassNamePrefix | capitalize }}User authenticate(String email, String password) {
		{{ userClassNamePrefix | capitalize }}User user = userDao.findByEmail(email);
		if (user != null && checkPassword(user.getHashedPassword(), password, user.getSalt())) {
			return user;
		}
		return null;
	}

	@Override
	public void updatePassword({{ userClassNamePrefix | capitalize }}User user, String password) {
		if (user != null) {
			String salt = generateSalt();
			user.setHashedPassword(hashPassword(password, salt));
			user.setSalt(salt);
		}
	}

	@Override
	public {{ userClassNamePrefix | capitalize }}User registerUser(String email, String password, String firstName, String lastName) {
		String salt = generateSalt();
		String hashedPassword = hashPassword(password, salt);
		{{ userClassNamePrefix | capitalize }}User user = new {{ userClassNamePrefix | capitalize }}User(email, hashedPassword, salt, firstName, lastName);
		userDao.persist(user);
		return user;
	}

	@Override
	public boolean checkPassword({{ userClassNamePrefix | capitalize }}User user, String password) {
		return checkPassword(user.getHashedPassword(), password, user.getSalt());
	}

	private boolean checkPassword(String hashedPassword, String clearPassword, String salt) {
		return hashedPassword.equals(hashPassword(clearPassword, salt));
	}

	private String hashPassword(String password, String salt) {
		// TODO: Implement this method in a proper way. Not prodable.
		return password + salt;
	}

	private String generateSalt() {
		// TODO: Implement this method in a proper way. Not prodable.
		return "";
	}
}
