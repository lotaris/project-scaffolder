package com.forbesdigital.dummy.rest.api;

import com.forbesdigital.dummy.RestPaths;
import com.forbesdigital.dummy.rest.AbstractRestApplication;
import javax.ws.rs.ApplicationPath;

/**
 * Rest application for the API
 *
 * @author Firstname Lastname <firstname.lastname@localhost.localdomain>
 */
@ApplicationPath(RestPaths.APPLICATION_API)
public class ApiRestApplication extends AbstractRestApplication {
	@Override
	protected String[] getPackages() {
		return new String[] { getClass().getPackage().getName() };
	}
}
