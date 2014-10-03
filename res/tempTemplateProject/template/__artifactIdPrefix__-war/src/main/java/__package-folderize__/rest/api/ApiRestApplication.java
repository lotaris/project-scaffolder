package {{ package }}.rest.api;

import {{ package }}.RestPaths;
import {{ package }}.rest.AbstractRestApplication;
import javax.ws.rs.ApplicationPath;

/**
 * Rest application for the API
 *
 * @author {{ authorFirstName }} {{ authorLastName }} <{{ authorEmail }}>
 */
@ApplicationPath(RestPaths.APPLICATION_API)
public class ApiRestApplication extends AbstractRestApplication {
	@Override
	protected String[] getPackages() {
		return new String[] { getClass().getPackage().getName() };
	}
}
