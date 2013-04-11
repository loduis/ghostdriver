require './spec_helper'

describe 'Ghostdriver' do
  $driver1 = nil
  $url     = 'http://localhost:4567/'

  describe 'Start' do
    it 'should start the session' do
      #$driver1 = Selenium::WebDriver.for(:phantomjs)
      $driver1 = Selenium::WebDriver.for(:remote, :url=> 'http://localhost:8910')
      #$driver1 = Selenium::WebDriver.for(:firefox)
    end
  end


  describe 'Basic' do
    it 'should navigate to a new URL' do
      $driver1.get($url)
    end

    it 'should retrieve the URL of the current page' do
      url = $driver1.current_url;
      url.should eq $url
    end

    it 'should get the current page title' do
      title = $driver1.title
      title.should eq 'Ghostdriver'
    end

    it 'should get the current page source' do
      source = $driver1.page_source
      source.should include('</html>')
    end

    it 'should retrieve the current window handle' do
      handle = $driver1.window_handle;
      handle.length.should eq 32
    end

    it 'should retrieve the list of all window handles available to the session' do
      handles = $driver1.window_handles;
      handles.length.should eq 1
    end

    it 'should set the amount of time the driver should wait when searching for elements' do
      $driver1.manage.timeouts.implicit_wait  = 1
    end

    it 'should sets the amount of time to wait for an asynchronous script to finish execution before throwing an error' do
      $driver1.manage.timeouts.script_timeout = 20
    end

    it 'should sets the amount of time to wait for a page load to complete before throwing an error' do
      $driver1.manage.timeouts.page_load = 10
    end

    it 'should take a screenshot of the current page' do
      $driver1.save_screenshot('./page.png')
      exists = File.exists?('./page.png')
      exists.should be true
    end

    it 'should Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame' do
      element = $driver1.script 'document.body.blur(); return document.activeElement;'
      # al parecer panthomjs nunca pierde el foco
      # al menos un elemento lo tiene
      element.tag_name.should eq 'body'
    end

    it 'should Inject a snippet of JavaScript into the page for execution asynchronous in the context of the currently selected frame' do
      title = $driver1.execute_async_script 'arguments[0](document.title)';
      title.should eq 'Ghostdriver'
    end

    it 'should refresh the current page' do
      $driver1.navigate.refresh
    end

    it 'should send a sequence of key strokes to an element' do
      element = $driver1.find_element(:name => 'q')
      point = element.location
      size  = element.size
      $driver1.action.send_keys(element, "Hello Ghostdriver!").perform
      element['value'].should eq "Hello Ghostdriver!"
      # restore to 0,0
      x = point.x  + ( size.width / 2).ceil
      y = point.y +  (size.height / 2).ceil
      $driver1.action.move_by(- x, - y).perform
    end

    it 'should get the status of the html5 application cache.' do
      $driver1.get_app_cache_status.should eq 0
    end

  end # Basic

  describe 'Alert' do
    it 'should gets the text of the currently displayed JavaScript alert(), confirm(), or prompt() dialog.' do
      element = $driver1.find_element(:id=>'alert')
      element.click()
      $driver1.switch_to.alert.text.should eq 'This is a test.'
    end
=begin
    it 'should Accepts the currently displayed alert dialog.' do
      element = $driver1.find_element(:id=>'alert')
      element.click()
      $driver1.switch_to.alert.accept
    end
=end
  end

  describe 'Mouse' do

    it 'should the mouse from its current position (or 0,0) by the given offset' do
      element = $driver1.find_element(:id=>'send')
      point = element.location
      size  = element.size
      $driver1.action.move_by(point.x + 5, point.y + 5).click.perform()
      $driver1.current_url.should eq $url + 'submit'
      $driver1.navigate.back
      # restore to 0,0
      x = point.x  + 5
      y = point.y +  5
      $driver1.action.move_by(- x, - y).perform
    end

    it "should move the mouse by an offset of the specificed element" do
      element = $driver1.find_element(:id=>'send')
      $driver1.action.move_to(element, 5, 5).perform;
    end

    it 'should click any mouse button (at the coordinates set by the last moveto command).' do
      $driver1.action.click.perform;
      $driver1.current_url.should eq $url + 'submit'
      $driver1.navigate.back
    end

    it 'should double-clicks at the current mouse coordinates (set by moveto).' do
      element = $driver1.find_element(:id=>'send')
      $driver1.action.double_click.perform;
      $driver1.current_url.should eq $url + 'submit'
      $driver1.navigate.back
    end

    it 'should performs a context-click at middle of the given element' do
      element = $driver1.find_element(:id=>'show_in_right_click')
      element.displayed?.should be false
      element = $driver1.find_element(:id=>'send')
      $driver1.action.context_click(element).perform;
      element = $driver1.find_element(:id=>'show_in_right_click')
      element.displayed?.should be true
      $driver1.current_url.should eq $url
    end

    it 'should click and hold the left mouse button (at the coordinates set by the last moveto command).' do
      element = $driver1.find_element(:id=>'send')
      $driver1.action.click_and_hold(element).perform;
      $driver1.current_url.should eq $url
    end

    it 'should releases the mouse button previously held (where the mouse is currently at).' do
      element = $driver1.find_element(:id=>'send')
      $driver1.action.release(element).perform;
      $driver1.current_url.should eq $url + 'submit'
      $driver1.navigate.back
    end

  end

  describe 'Cookie' do
    it 'should retrieve all cookies visible to the current page' do
      cookies = $driver1.manage.all_cookies
      cookies.length.should eq 0
    end

    it 'should set a cookie.' do
      $driver1.manage.add_cookie(:name=>'test1', :value=> 'cookie')
      $driver1.manage.add_cookie(:name=>'test2', :value=> 'cookie')
      cookies = $driver1.manage.all_cookies
      cookies.length.should eq 2
    end

    it 'should delete the cookie with the given name' do
      $driver1.manage.delete_cookie('test1')
      cookies = $driver1.manage.all_cookies
      cookies.length.should eq 1
    end

    it 'should delete all cookies visible to the current page.' do
      $driver1.manage.delete_all_cookies()
      cookies = $driver1.manage.all_cookies
      cookies.length.should eq 0
    end
  end # Cookie

  describe 'LocalStore' do

    it 'should clear the storage.' do
      $driver1.local_storage.clear
    end

    it 'should get all keys of the storage' do
      keys = $driver1.local_storage.keys
      p keys
      keys.length.should eq 0
    end

    it 'should get the number of items in the storage' do
      $driver1.local_storage.size.should eq 0
    end

    it 'should set the storage item for the given key' do
      $driver1.local_storage['test'] = 'local'
      $driver1.local_storage.size.should eq 1
    end

    it 'should get the storage item for the given key' do
      value = $driver1.local_storage['test']
      value.should eq 'local'
    end

    it 'should remove the storage item for the given key' do
      $driver1.local_storage.delete('test')
      $driver1.local_storage.size.should eq 0
    end

  end # LocalStore

  describe 'SessionStore' do

    it 'should get the number of items in the storage' do
      $driver1.session_storage.size.should eq 0
    end

    it 'should set the storage item for the given key' do
      $driver1.session_storage['test1'] = 'local'
      $driver1.session_storage['test2'] = 'local'
      $driver1.session_storage.size.should eq 2
    end

    it 'should get the storage item for the given key' do
      value = $driver1.session_storage['test1']
      value.should eq 'local'
    end

    it 'should remove the storage item for the given key' do
      $driver1.session_storage.delete('test1')
      $driver1.session_storage.size.should eq 1
    end

    it 'should get all keys of the storage' do
      keys = $driver1.session_storage.keys
      keys.length.should eq 1
    end

    it 'should clear the storage.' do
      $driver1.session_storage.clear
      $driver1.session_storage.size.should eq 0
    end

  end # SessionStore


  describe 'Element' do
    it 'should search for an element on the page by tag name.' do
      element = $driver1.find_element(:tag_name=> 'h1')
      element.class.should eq Selenium::WebDriver::Element
    end

    it 'should search for an element on the page by css.' do
      element = $driver1.find_element(:css=> '.container > h1')
      element.class.should eq Selenium::WebDriver::Element
    end

    it 'should search for an element on the page by id.' do
      element = $driver1.find_element(:id=>'form')
      element.class.should eq Selenium::WebDriver::Element
    end

    it 'should search for an element on the page class name' do
      element = $driver1.find_element(:class=>'element')
      element.class.should eq Selenium::WebDriver::Element
    end

    it 'should search for an element on the page by xpath' do
      element = $driver1.find_element(:xpath=>'//div/h1')
      element.class.should eq Selenium::WebDriver::Element
    end

    it 'should search for an element on the page by link text' do
      element = $driver1.find_element(:link=>'Open alert')
      element.class.should eq Selenium::WebDriver::Element
    end

    it 'should search for an element on the page by partial link text' do
      element = $driver1.find_element(:partial_link_text=>'alert')
      element.class.should eq Selenium::WebDriver::Element
    end

    it 'should search for an element on the page by name.' do
      element = $driver1.find_element(name: 'q')
      element.class.should eq Selenium::WebDriver::Element
    end

    it 'should throw exception by not element in the page' do
      expect {
        $driver1.find_element(:tag_name=>'alert')
      }.to raise_error(Selenium::WebDriver::Error::NoSuchElementError)
    end

    it 'should throw exception by invalid xpath' do
      expect {
        $driver1.find_element(:xpath=>'.$d&alert')
      }.to raise_error(Selenium::WebDriver::Error::InvalidSelectorError)
    end

    it 'should throw exception by invalid css selector' do
      expect {
        $driver1.find_element(:css=>'$dalert')
      }.to raise_error(Selenium::WebDriver::Error::InvalidSelectorError)
    end

    it 'should throw exception by invalid class name' do
      expect {
        $driver1.find_element(:class=>'10')
      }.to raise_error(Selenium::WebDriver::Error::InvalidSelectorError)
    end

    it 'should retrieve the value attribute of an element' do
      element = $driver1.find_element(:name=> 'q')
      element.send_keys 'this an test'
      element['value'].should eq 'this an test'
    end

    it 'should retrieve the value of the invalid attribute of an element' do
      element = $driver1.find_element(:id=> 'html')
      element['invalid'].should eq nil
    end

    it 'should determine if an element is currently enabled' do
      element = $driver1.find_element(:name=> 'p')
      element.enabled?.should be true
      # one html return true
      element = $driver1.find_element(:id=> 'html')
      element.enabled?.should be true

      element = $driver1.find_element(:id=> 'disabled')
      element.enabled?.should be false

    end

    it 'should determine if an OPTION element, or an INPUT element of type checkbox or radiobutton is currently selected' do
      element = $driver1.find_element(:id => 'radio_checked')
      element.selected?.should be true

      element = $driver1.find_element(:id => 'checkbox_checked')
      element.selected?.should be true

      element = $driver1.find_element(:css => '#select > option[value="on"]')
      element.selected?.should be true

      element = $driver1.find_element(:id => 'radio_unchecked')
      element.selected?.should be false

      element = $driver1.find_element(:id => 'checkbox_unchecked')
      element.selected?.should be false

      element = $driver1.find_element(:css => '#select > option[value="off"]')
      element.selected?.should be false
    end

    it 'should throw exception by element not selectable' do
      expect {
        element = $driver1.find_element(:id => 'html')
        element.selected?()
      }.to raise_error(Selenium::WebDriver::Error::ElementNotSelectableError)
    end

    it 'should determine if an element is currently displayed' do
      element = $driver1.find_element(:id=> 'html')
      element.displayed?.should be true

      element = $driver1.find_element(:id=> 'disabled')
      element.displayed?.should be false

    end

    it 'should returns the visible text for the element' do
      element = $driver1.find_element(:id=> 'html')
      element.text.should eq 'This my innerHTML'
    end

    it "should query the value of an element's computed CSS property" do
      element = $driver1.find_element(:id=> 'disabled')
      element.style('display').should eq 'none'
    end

    it "should determine an element's size in pixels" do
      element = $driver1.find_element(:id=> 'html')
      size = element.size
      size.class.should eq Selenium::WebDriver::Dimension
      size.width.should eq 200
      size.height.should eq 50
    end

    it "should determine an element's location on the page" do
      element = $driver1.find_element(:id=> 'html')
      point = element.location
      point.class.should eq Selenium::WebDriver::Point
      point.x.should eq 0
      point.y.should eq 15
    end

    it "should Determine an element's location on the screen once it has been scrolled into view" do
      element = $driver1.find_element(:id=> 'html')
      point = element.location_once_scrolled_into_view
      point.class.should eq Selenium::WebDriver::Point
      point.x.should eq 0
      point.y.should eq 15
    end

    it "should query for an element's tag name" do
      element = $driver1.find_element(:id=> 'html')
      element.tag_name.should eq 'div'
    end

    it "should get the element on the page that currently has focus" do
      element = $driver1.find_element(:tag_name=> 'body')
      element.click()
      element = $driver1.switch_to.active_element
      element.class.should eq Selenium::WebDriver::Element
      element.tag_name.should eq 'body'
    end

    it 'should search for an element on the page, starting from the identified element' do
      element = $driver1.find_element(:class=> 'container')
      child   = element.find_element(:class, 'element')
      child.class.should eq Selenium::WebDriver::Element
      child.tag_name.should eq 'div'
    end

    it 'should search for multiple elements on the page, starting from the identified element' do
      element = $driver1.find_element(:class=> 'container')
      childs   = element.find_elements(:class, 'element')
      childs.length.should eq 3
    end

    it "should clear a TEXTAREA or text INPUT element's value." do
      element = $driver1.find_element(:name => 'q')
      element.clear()
      element = $driver1.switch_to.active_element
      element.tag_name.should eq 'input'
    end

    it 'should submit a FORM element. The submit command may also be applied to any element that is a descendant of a FORM element' do
      element = $driver1.find_element(:id => 'send')
      element.submit
      $driver1.current_url.should eq $url + 'submit'
      $driver1.navigate.back
      $driver1.current_url.should eq $url
    end

    it 'should click on an element.' do
      element = $driver1.find_element(:id => 'send')
      element.click
      $driver1.current_url.should eq $url + 'submit'
      $driver1.navigate.back
      $driver1.current_url.should eq $url
    end

    it 'should send a sequence of key strokes to an element' do
      element = $driver1.find_element(:name => 'q')
      element.send_keys "Hello Ghostdriver!"
      element['value'].should eq "Hello Ghostdriver!"
    end

    it 'should Test if two element IDs refer to the same DOM element.' do
      element = $driver1.find_element(:name => 'q')
      puts element.eql?(element).should be true;
      other  = $driver1.find_element(:id => 'send')
      puts element.eql?(other).should be false;
    end

  end # Element

  describe 'Elements' do
    it 'should search for multiple elements on the page, starting from the document root by css.' do
      elements = $driver1.find_elements(:css=> '.container > *')
      elements.length.should eq 6
    end

    it 'should search for multiple elements on the page, starting from the document root by class name.' do
      elements = $driver1.find_elements(:class=> 'element')
      elements.length.should eq 3
    end

    it 'should search for multiple elements on the page, starting from the document root by tag name.' do
      elements = $driver1.find_elements(:tag_name=> 'div')
      elements.length.should eq 6
    end

    it 'should search for multiple elements on the page, starting from the document root by xpath.' do
      elements = $driver1.find_elements(:xpath=> '//div')
      elements.length.should eq 6
    end


    it 'should search for multiple elements on the page, starting from the document root by name.' do
      elements = $driver1.find_elements(:name=> 'p')
      elements.length.should eq 2
    end

    it 'should return empty array by not elements in the page' do
      elements = $driver1.find_elements(:tag_name=>'alert')
      elements.length.should eq 0
    end

    it 'should throw exception by invalid xpath' do
      expect {
        elements = $driver1.find_elements(:xpath=>'.$d&alert')
      }.to raise_error(Selenium::WebDriver::Error::InvalidSelectorError)
    end

    it 'should throw exception by invalid css selector' do
      expect {
        $driver1.find_elements(:css=>'$dalert')
      }.to raise_error(Selenium::WebDriver::Error::InvalidSelectorError)
    end

    it 'should throw exception by invalid class name' do
      expect {
        $driver1.find_elements(:class=>'10')
      }.to raise_error(Selenium::WebDriver::Error::InvalidSelectorError)
    end
  end # Elements

  describe 'Window' do
    it 'should get the size of the specified window' do
      size = $driver1.manage.window.size()
      size.class.should eq Selenium::WebDriver::Dimension
      size.width.should eq 400
      size.height.should eq 300
    end

    it 'should change the size of the specified window' do
      dimension = Selenium::WebDriver::Dimension.new 1024, 768
      $driver1.manage.window.size = dimension
      size = $driver1.manage.window.size()
      size.class.should eq Selenium::WebDriver::Dimension
      size.width.should eq 1024
      size.height.should eq 768
    end

    it 'should get the position of the specified window' do
      position = $driver1.manage.window.position
      position.class.should eq Selenium::WebDriver::Point
      position.x.should eq 0
      position.y.should eq 0
    end

    it 'should change the position of the specified window' do
      position = Selenium::WebDriver::Point.new 10, 20
      $driver1.manage.window.position = position
      position.class.should eq Selenium::WebDriver::Point
      position.x.should eq 10
      position.y.should eq 20
    end

    it 'should maximize the specified window if not already maximized' do
      $driver1.manage.window.maximize()
      get_screen_size.should eq $driver1.manage.window.size
    end

    it 'should change focus to another window. The window to change focus to may be specified by its server assigned window handle, or by the value of its name attribute.' do
      handle = $driver1.window_handle()
      $driver1.switch_to.window(handle)
    end

    it 'should change focus to another frame on the page.' do
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
    end

    it 'should navigate backwards in the browser history, if possible.' do
      $driver1.navigate.back
      $driver1.current_url.should eq $url
      $driver1.navigate.back
      $driver1.current_url.should eq $url
    end

    it 'should navigate forwards in the browser history, if possible' do
      $driver1.navigate.forward
      $driver1.current_url.should eq $url + 'frame'
      $driver1.navigate.forward
      $driver1.current_url.should eq $url + 'frame'
    end


    it 'should close the current window' do
      $driver1.close()
    end

    it 'should throw exception by closed window on navigate to a new URL' do
      expect {
        $driver1.get($url)
      }.to raise_error Selenium::WebDriver::Error::NoSuchWindowError
    end

    it 'should throw exception by closed window on retrieve the URL of the current page' do
      expect {
        $driver1.current_url;
      }.to raise_error Selenium::WebDriver::Error::NoSuchWindowError
    end

    it 'should throw exception by closed window on get the current page title' do
      expect {
        $driver1.title
      }.to raise_error Selenium::WebDriver::Error::NoSuchWindowError
    end

  end # Window

  describe 'Stop' do
    it 'should close the session' do
      $driver1.quit()
    end
  end # Stop

end # Ghostdriver
