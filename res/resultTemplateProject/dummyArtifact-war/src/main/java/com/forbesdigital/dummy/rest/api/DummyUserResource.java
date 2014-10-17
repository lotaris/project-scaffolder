package com.forbesdigital.dummy.rest.api;

import com.forbesdigital.dummy.RestPaths;
import com.forbesdigital.dummy.model.DummyUser;
import com.forbesdigital.dummy.persistence.IDummyUserDao;
import com.forbesdigital.dummy.rest.AbstractResource;
import com.forbesdigital.dummy.to.dummyuser.DummyUserReadTO;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.PathParam;

/**
 * REST resource for {@link DummyUser}.
 *
 * Is used for - User registration - Credentials check - User retrieval
 *
 * @author Firstname Lastname <firstname.lastname@localhost.localdomain>
 */
@Stateless
@Path(RestPaths.API_USERS_PATH)
public class DummyUserResource extends AbstractResource {
	@EJB
	private IDummyUserDao userDao;

	@GET
	@Path("{userId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response retrieve(@PathParam("userId") String userId) {
		DummyUser user = userDao.findByEmail(userId);

		DummyUserReadTO returnValue = convertToTransferObject(user);
		return Response.ok(returnValue).build();
	}

	/**
	 * Converts a dummy user entity to a transfer object.
	 */
	private DummyUserReadTO convertToTransferObject(DummyUser user) {
		DummyUserReadTO to = new DummyUserReadTO();
		to.setUserId(user.getId().toString());
		to.setEmail(user.getEmail());
		to.setFirstName(user.getFirstName());
		to.setLastName(user.getLastName());
		return to;
	}
}
