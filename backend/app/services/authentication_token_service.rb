require 'jwt'

class AuthenticationTokenService
  HMAC_SECRET = Rails.application.credentials[:HMAC_SECRET]
  ALGORITHM_TYPE = 'HS256'
  def self.encode(user_id)
    payload = {
      user_id: user_id
    }
    token = JWT.encode payload, HMAC_SECRET, ALGORITHM_TYPE
  end

  def self.decode(token)
    decoded_token = JWT.decode token, HMAC_SECRET, true, {algorithm: ALGORITHM_TYPE }
    decoded_token[0]['user_id'].to_i
  end
end