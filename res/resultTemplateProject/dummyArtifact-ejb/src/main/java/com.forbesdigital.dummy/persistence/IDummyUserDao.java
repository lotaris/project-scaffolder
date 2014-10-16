package com.forbesdigital.dummy.persistence;

import com.forbesdigital.dummy.model.DummyUser;
import javax.ejb.Local;

/**
 * @see DummyUser
 * @author Firstname Lastname <firstname.lastname@localhost.localdomain>
 */
@Local
public interface IDummyUserDao {
	/**
	 * Persist a new user
	 */
	void persist(DummyUser user);

	/**
	 * Retrieves a dummy user by email address.
	 *
	 * @param email email address of the dummy user
	 * @return User if found, null otherwise.
	 */
	DummyUser findByEmail(String email);
}
