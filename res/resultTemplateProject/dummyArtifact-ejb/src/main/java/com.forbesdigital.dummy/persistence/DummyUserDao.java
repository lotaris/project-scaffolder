package com.forbesdigital.dummy.persistence;

import com.forbesdigital.dummy.model.DummyUser;
import com.forbesdigital.dummy.model.QueryNames;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ejb.Stateless;
import javax.persistence.Query;

/**
 * @author Firstname Lastname <firstname.lastname@localhost.localdomain>
 */
@Stateless
public class DummyUserDao implements IDummyUserDao {
	@PersistenceContext(unitName = "DataBasePersistenceUnit")
	private EntityManager em;

	@Override
	public void persist(DummyUser user) {
		em.persist(user);
	}

	@Override
	public DummyUser findByEmail(String email) {
		Query query = em.createNamedQuery(QueryNames.DUMMYUSER_FINDBYEMAIL);
		query.setParameter("email", email);
		return (DummyUser) query.getSingleResult();
	}
}
