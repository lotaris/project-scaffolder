package com.forbesdigital.dummy.service;

import com.forbesdigital.dummy.model.DummyUser;
import com.forbesdigital.dummy.persistence.IDummyUserDao;
import javax.ejb.EJB;
import javax.ejb.Stateless;

/**
 * @author Firstname Lastname <firstname.lastname@localhost.localdomain>
 */
@Stateless
public class DummyUserService implements IDummyUserService {

	@EJB
	private IDummyUserDao userDao;

	@Override
	public DummyUser authenticate(String email, String password) {
		DummyUser user = userDao.findByEmail(email);
		if (user != null && checkPassword(user.getHashedPassword(), password, user.getSalt())) {
			return user;
		}
		return null;
	}

	@Override
	public void updatePassword(DummyUser user, String password) {
		if (user != null) {
			String salt = generateSalt();
			user.setHashedPassword(hashPassword(password, salt));
			user.setSalt(salt);
		}
	}

	@Override
	public DummyUser registerUser(String email, String password, String firstName, String lastName) {
		String salt = generateSalt();
		String hashedPassword = hashPassword(password, salt);
		DummyUser user = new DummyUser(email, hashedPassword, salt, firstName, lastName);
		userDao.persist(user);
		return user;
	}

	@Override
	public boolean checkPassword(DummyUser user, String password) {
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
