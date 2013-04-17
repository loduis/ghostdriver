require './spec_helper'

describe 'Ghostdriver' do
  $driver1 = nil
  $url     = 'http://localhost:4567/'
  $remote  = 'http://localhost:8910'

  describe 'Start' do
    it 'should start the session' do
        # $driver1 = Selenium::WebDriver.for(:phantomjs)
        # $driver1 = Selenium::WebDriver.for(:chrome)
        $driver1 = Selenium::WebDriver.for(:remote, :url=> $remote)
    end
  end

  describe 'Basic' do

    it 'should navigate to a new URL' do
      $driver1.get($url)
    end

    it 'should change focus to another window.
        The window to change focus to may be specified by its server
        assigned window handle, or by the value of its name attribute.' do
      current = $driver1.window_handle
      element = $driver1.find_element :id => 'popup'
      element.click
      handles = $driver1.window_handles;
      handles.length.should eq 2
      handles.each do |value|
        if value != current
          $driver1.switch_to.window(value)
          $driver1.window_handle.should eq value
          element = $driver1.find_element :id => 'child_popup'
          $driver1.close # close the window
          expect {
            element = $driver1.find_element :id => 'child_popup'
            }.to raise_error(Selenium::WebDriver::Error::NoSuchWindowError)
          break
        end
      end
      handles = $driver1.window_handles;
      handles.length.should eq 1
      $driver1.switch_to.window(current)
    end


    it 'should Inject a snippet of JavaScript into the page for execution
        asynchronous in the context of the currently selected frame' do
      title = $driver1.execute_async_script 'arguments[0](document.title)';
      title.should eq 'Ghostdriver'
    end

    it 'should refresh the current page' do
      $driver1.navigate.refresh
    end


    it 'should change focus to another frame on the page.' do
      current = $driver1.window_handle
      $driver1.get($url + 'frame')
      $driver1.current_url.should eq $url + 'frame'
      # frame by index
      $driver1.switch_to.frame(0)
      element = $driver1.find_element(:id=> 'left')
      element.tag_name.should eq 'div'
      # change to main frame
      $driver1.switch_to.frame(nil)
      # by name
      $driver1.switch_to.frame('left')
      element = $driver1.find_element(:id=> 'left')
      element.tag_name.should eq 'div'
      # get iframe
      $driver1.switch_to.frame(0)
      element = $driver1.find_element(:id=> 'iframe')
      element.tag_name.should eq 'div'
      # change to main frame
      $driver1.switch_to.frame(nil)
      # frame by index
      $driver1.switch_to.frame(1)
      element = $driver1.find_element(:id=> 'right')
      element.tag_name.should eq 'div'
      # change to main frame
      $driver1.switch_to.frame(nil)
      $driver1.switch_to.frame('right')
      element = $driver1.find_element(:id=> 'right')
      element.tag_name.should eq 'div'
      $driver1.navigate.back
      $driver1.switch_to.window(current)
      $driver1.window_handle.should eq current
    end

  end
end