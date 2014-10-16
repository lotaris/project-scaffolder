package {{ package }}.rest;

import java.util.HashSet;
import java.util.Set;
import javax.ws.rs.Path;
import javax.ws.rs.core.Application;
import org.codehaus.jackson.jaxrs.JacksonJsonProvider;
import org.reflections.Reflections;
import org.reflections.scanners.TypeAnnotationsScanner;
import org.reflections.util.ClasspathHelper;
import org.reflections.util.FilterBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * JAX-RS application that will be mounted at the path specified by the <tt>@ApplicationPath</tt>
 * annotation (relative to the context root). Implement {@link #configureResources(java.util.Set)}
 * and add your resources to the provided set.
 *
 * <pre>
 *	&#64;ApplicationPath("foo")
 *	public class FooRestApplication extends AbstractRestApplication {
 *
 *		&#64;Override
 *		protected void configureResources(Set<Class<?>> resources) {
 *			resources.add(ApplicationResource.class);
 *			resources.add(UserResource.class);
 *		}
 *	}
 * </pre>
 *
 * @author {{ authorFirstName }} {{ authorLastName }} <{{ authorEmail }}>
 */
public abstract class AbstractRestApplication extends Application {
	private static final Logger LOG = LoggerFactory.getLogger(AbstractRestApplication.class);

	private Set<Class<?>> classes;

	public AbstractRestApplication() {
		build();
	}

	private void build() {
		classes = new HashSet<>();

		// Scan every packages to get @Path annotated classes
		for (String pckg : getPackages()) {
			classes.addAll(new Reflections(
					ClasspathHelper.forPackage(pckg), new TypeAnnotationsScanner(), new FilterBuilder().includePackage(pckg)).
					getTypesAnnotatedWith(Path.class));
		}

		if (LOG.isTraceEnabled()) {
			for (Class cl : classes) {
				LOG.trace("Class registered: {}", cl.getCanonicalName());
			}
		}
	}

	@Override
	public Set<Class<?>> getClasses() {
		return classes;
	}

	@Override
	public Set<Object> getSingletons() {
		final Set<Object> singletons = new HashSet<>(1);
		singletons.add(new JacksonJsonProvider());
		return singletons;
	}

	/**
	 * @return Give the list of packages to scan to retrieve resources.
	 */
	protected abstract String[] getPackages();
}
