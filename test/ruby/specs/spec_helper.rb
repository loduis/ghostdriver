require 'selenium-webdriver'

RSpec.configure {|c|
  c.fail_fast = true
  c.formatter  = :documentation
}

module Selenium
  module WebDriver
    module Remote
      class Bridge
        def driver_extensions
          [
            DriverExtensions::HasInputDevices,
            DriverExtensions::UploadsFiles,
            DriverExtensions::TakesScreenshot,
            DriverExtensions::HasSessionId,
            DriverExtensions::HasWebStorage # support for local storage
          ]
        end
      end
    end
  end
end

# support for run code with


$main = File.join(File.dirname(File.dirname(__FILE__)), 'src', 'main.js');

module Selenium
  module WebDriver
    module PhantomJS
      class Service
        def create_process(args)
          server_command = [@executable, "--debug=yes", $main]
          process = ChildProcess.build(*server_command.compact)
          if $DEBUG == true
            process.io.inherit!
          elsif Platform.jruby?
            # apparently we need to read the output for phantomjs to work on jruby
            process.io.stdout = process.io.stderr = File.new(Platform.null_device, 'w')
          end

          process
        end
      end
    end
  end
end