package com.forbesdigital.dummy.service;

import com.forbesdigital.dummy.model.DummyUser;

import javax.ejb.Local;

/**
 * Service managing {@link User}.
 *
 * @author Firstname Lastname <firstname.lastname@localhost.localdomain>
 */
@Local
public interface IDummyUserService {

	/**
	 * Authenticate the user given an email and a password.
	 * An authentication is valid if and only if:
	 * <ul>
	 *	<li>the user exists (persisted)</li>
	 *  <li>the user is {@link User.active}</li>
	 *	<li>the password matches</li>
	 * </ul>
	 *
	 * @param email Email of the user
	 * @param password Password of the user in plaintext (for now)
	 * @return {@link  User} if the authentication passed successfully
	 * <tt>NULL</tt> otherwise.
	 */
	DummyUser authenticate(String email, String password);

	/**
	 * Updates the password of the provided user (generates a new salt and hashes the provided password).
	 *
	 * @param user the user for which the password should be updated
	 * @param password the new password, in plain-text
	 */
	void updatePassword(DummyUser user, String password);

	/**
	 * Registers a new user with the provided parameters.
	 *
	 * @param email the email address, used as a username
	 * @param password the user password in plain-text
	 * @param firstName the first name of the user
	 * @param lastName the last name of the user
	 * @return a new user
	 */
	DummyUser registerUser(String email, String password, String firstName, String lastName);

	/**
	 * Checks that the provided password matches the one of the provided user.
	 *
	 * @param user the user for whom the password check is made
	 * @param password the password to be checked
	 * @return true, if both passwords match; false, otherwise
	 */
	boolean checkPassword(DummyUser user, String password);
}
