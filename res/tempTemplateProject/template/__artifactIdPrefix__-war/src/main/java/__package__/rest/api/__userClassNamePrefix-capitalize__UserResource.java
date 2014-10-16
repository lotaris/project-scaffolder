package {{ package }}.rest.api;

import {{ package }}.RestPaths;
import {{ package }}.model.{{ userClassNamePrefix | capitalize }}User;
import {{ package }}.persistence.I{{ userClassNamePrefix | capitalize }}UserDao;
import {{ package }}.rest.AbstractResource;
import {{ package }}.to.{{ userClassNamePrefix | lower }}user.{{ userClassNamePrefix | capitalize }}UserReadTO;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.PathParam;

/**
 * REST resource for {@link {{ userClassNamePrefix | capitalize }}User}.
 *
 * Is used for - User registration - Credentials check - User retrieval
 *
 * @author {{ authorFirstName }} {{ authorLastName }} <{{ authorEmail }}>
 */
@Stateless
@Path(RestPaths.API_USERS_PATH)
public class {{ userClassNamePrefix | capitalize }}UserResource extends AbstractResource {
	@EJB
	private I{{ userClassNamePrefix | capitalize }}UserDao userDao;

	@GET
	@Path("{userId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response retrieve(@PathParam("userId") String userId) {
		{{ userClassNamePrefix | capitalize }}User user = userDao.findByEmail(userId);

		{{ userClassNamePrefix | capitalize }}UserReadTO returnValue = convertToTransferObject(user);
		return Response.ok(returnValue).build();
	}

	/**
	 * Converts a {{ userClassNamePrefix | lower }} user entity to a transfer object.
	 */
	private {{ userClassNamePrefix | capitalize }}UserReadTO convertToTransferObject({{ userClassNamePrefix | capitalize }}User user) {
		{{ userClassNamePrefix | capitalize }}UserReadTO to = new {{ userClassNamePrefix | capitalize }}UserReadTO();
		to.setUserId(user.getId().toString());
		to.setEmail(user.getEmail());
		to.setFirstName(user.getFirstName());
		to.setLastName(user.getLastName());
		return to;
	}
}
