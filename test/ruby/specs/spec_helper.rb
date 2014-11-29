require 'rspec/core'
require 'selenium-webdriver'
require 'json'
require 'Win32API' if Selenium::WebDriver::Platform.windows?

RSpec.configure {|c|
  c.fail_fast = true
  c.formatter  = :documentation
}

def get_screen_size
  if Selenium::WebDriver::Platform.linux?
    width, height = `xrandr`.scan(/current (\d+) x (\d+)/).flatten
    # bug phantomjs
    #width = 1024
    #height = 768

    Selenium::WebDriver::Dimension.new width.to_i, height.to_i
  elsif Selenium::WebDriver::Platform.windows?
    getSystemMetrics = Win32API.new("user32",     "GetSystemMetrics", ['I'], 'I')
    width  = getSystemMetrics.call(0)
    height = getSystemMetrics.call(1)
    Selenium::WebDriver::Dimension.new width, height
  else
    raise "Implement this method in this Platform"
  end

end


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

        def getAppCacheStatus
          execute :getAppCacheStatus
        end

        def describeElement(element)
          execute :describeElement, :id => element
        end

      end
    end
  end
end

module Selenium
  module WebDriver
    class Driver

      def __get_app_cache_status__
        bridge.getAppCacheStatus
      end

    end
  end
end

module Selenium
  module WebDriver
    class Element
      def __describe__
        bridge.describeElement @id
      end

      def __drag__(x, y)
        brige.dragElement @id, x, y
      end
    end
  end
end


=begin
module Selenium
  module WebDriver
    module Chrome
      class Bridge
        def driver_extensions
          [
            DriverExtensions::TakesScreenshot,
            DriverExtensions::HasInputDevices,
            DriverExtensions::HasWebStorage # support for local storage
          ]
        end
      end

    end
  end
end
=end


# support for run code with

=begin
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
=end