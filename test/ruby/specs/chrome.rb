require './spec_helper'

describe 'Ghostdriver' do
  $driver1 = nil
  $url     = 'http://localhost:4567/'

  describe 'Start' do
    it 'should start the session' do
      #$driver1 = Selenium::WebDriver.for(:phantomjs)
      #$driver1 = Selenium::WebDriver.for(:remote, :url=> 'http://localhost:8910')
      $driver1 = Selenium::WebDriver.for(:chrome)
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

  end # Basic

  describe 'Alert' do
    it 'should gets the text of the currently displayed JavaScript alert(), confirm(), or prompt() dialog.' do
      element = $driver1.find_element(:id=>'alert')
      element.click()
      #$driver1.save_screenshot('./page.png')
      $driver1.switch_to.alert.text.should eq 'This is a test.'
      $driver1.action.send_keys(:enter).perform
    end
  end

  describe 'Mouse' do
=begin
    it "should move the mouse by an offset of the specificed element" do
      element = $driver1.find_element(:id=>'send')
      $driver1.action.move_to(element, 5, 5).perform;
    end

    it 'should click any mouse button (at the coordinates set by the last moveto command).' do
      element = $driver1.find_element(:id=>'send')
      $driver1.action.click.perform;
      $driver1.current_url.should eq $url + 'submit'
      $driver1.navigate.back
    end

    it 'should click and hold the left mouse button (at the coordinates set by the last moveto command).' do
      element = $driver1.find_element(:id=>'send')
      $driver1.action.click_and_hold(element).perform;
    end

    it 'should releases the mouse button previously held (where the mouse is currently at).' do
      element = $driver1.find_element(:id=>'send')
      $driver1.action.release(element).perform;
    end
=end
=begin
    it 'should performs a context-click at middle of the given element' do
      element = $driver1.find_element(:id=>'show_in_right_click')
      element.displayed?.should be false
      element = $driver1.find_element(:id=>'send')
      $driver1.action.context_click(element).perform;
      element = $driver1.find_element(:id=>'show_in_right_click')
      element.displayed?.should be true
      $driver1.current_url.should eq $url
    end
=end

    it 'should the mouse from its current position (or 0,0) by the given offset' do
      element = $driver1.find_element(:id=>'send')
      point = element.location
      puts "X: " << (point.x + 5).to_s
      $driver1.action.move_by(point.x + 5, point.y + 5).click.perform()
      $driver1.current_url.should eq $url + 'submit'
      $driver1.navigate.back
      $driver1.action.move_by(0, 0)
    end

    it 'should Inject a snippet of JavaScript into the page for execution asynchronous in the context of the currently selected frame' do
      title = $driver1.execute_async_script 'arguments[0](document.title)';
      title.should eq 'Ghostdriver'
    end
  end

  describe 'Stop' do
    it 'should close the session' do
      $driver1.quit()
    end
  end # Stop

end # Ghostdriver
