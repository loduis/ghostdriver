require './spec_helper'

describe 'Ghostdriver' do
  $driver1 = nil
  $url     = 'http://localhost:4567/'

  describe 'Start' do
    it 'should start the session' do
      #$driver1 = Selenium::WebDriver.for(:phantomjs)

      $driver1 = Selenium::WebDriver.for(:remote, :url=> 'http://localhost:8910')
      # $driver1 = Selenium::WebDriver.for(:chrome)
    end
  end


  describe 'Basic' do
    it 'should navigate to a new URL' do
      $driver1.get($url)
    end

    it 'should retrieve the value of the invalid attribute of an element' do
      element = $driver1.find_element(:id=> 'html')
      element['invalid'].should eq nil
      raise 'Error..'
    end

  end # Basic

  describe 'Stop' do
    it 'should close the session' do
      $driver1.quit()
    end
  end # Stop

end # Ghostdriver
